import { HttpService, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { DbService } from './db/db.service';
import { User } from './models/user.model';
//import * as mongodb from 'mongodb';

interface HistoricalStockOptions {
  stockTicker: string;
  startDate: string;
  endDate: string;
}

interface StockPurchase {
  stockTicker: string;
  quantity: number;
  userName: string;
}

@Injectable()
export class StockService {
  private static readonly BASE_URL = `https://api.polygon.io/v2`;

  private API_KEYS = [
    process.env.POLYGON_API_KEY0,
    process.env.POLYGON_API_KEY1,
    process.env.POLYGON_API_KEY2,
    process.env.POLYGON_API_KEY3,
    process.env.POLYGON_API_KEY4,
    process.env.POLYGON_API_KEY5,
    process.env.POLYGON_API_KEY6
];
    private KEY_IDX = 0;

    private getApiKey(){
        this.KEY_IDX++; 
        return this.API_KEYS[ this.KEY_IDX % this.API_KEYS.length ];
}

  constructor(
    private readonly httpService: HttpService,
    private readonly dbService: DbService
  ) {}

  async getStock(ticker: string): Promise<any> {
    return this.httpService
      .get('/reference/tickers', {
        baseURL: StockService.BASE_URL,
        params: {
          perpage: 100,
          page: 1,
          apiKey: this.getApiKey(),
          search: ticker,
          sort: 'ticker',
        },
      })
      .toPromise()
      .then((response) => response.data.tickers)
      .catch((error) => {
        console.log(error);
      });
  }

  async getOwnedStock(userName: string): Promise<any> {
    return this.dbService.getOwnedStock( userName );
  }

  async getStockPriceVantage(ticker: string): Promise<any> {
    return this.httpService
      .get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`)
      .toPromise()
      .then((response) => {
        return response.data[ 'Global Quote'][ '05. price' ];
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getStockHistorical(
    historicalStockOptions: HistoricalStockOptions
  ): Promise<any> {
    const { stockTicker, startDate, endDate } = historicalStockOptions;

    return this.httpService
      .get(
        `/aggs/ticker/${stockTicker}/range/1/day/${moment(startDate).format(
          'YYYY-MM-DD'
        )}/${moment(endDate).format('YYYY-MM-DD')}`,
        {
          baseURL: StockService.BASE_URL,
          params: {
            unadjusted: true,
            sort: 'asc',
            limit: 120,
            apiKey: this.getApiKey(),
          },
        }
      )
      .toPromise()
      .then((response) => {
        return response.data.results.map((result) => ({
          date: moment(result.t).toISOString(),
          close: result.c,
          ticker: stockTicker
        }))
        }
      )
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }

  async getUserInfo(userName: string): Promise<User> {
    return this.dbService.getUserInfo(userName);
  }

  async buyStock(purchaseOptions: StockPurchase) {
    const {
      stockTicker,
      quantity,
      userName
    } = purchaseOptions;
    // get current value of stock
    const currentStockPrice = await this.getStockPriceVantage( purchaseOptions.stockTicker );
    const {
      name,
      username,
      userId,
      stocksOwned,
      cashValue
    } = await this.dbService.getUserInfo(userName);
    // check to see if the user has enough money
    if( currentStockPrice*quantity <= cashValue ) {
      // Push new transaction
      await this.dbService.runPurchaseTransaction( { 
        quantity, 
        timestamp: moment().toISOString(), 
        authorizingUserId: userId,
        purchasePrice:currentStockPrice,
        tickerSymbol:stockTicker 
      });

      return this.dbService.getAccountEvaluation( username, stockTicker, currentStockPrice );
      // Update user file
    }
    else {
      throw new Error( 'User does not have sufficient funds' );
    }
    // if no, throw you are poor exception
    // if yes, update the stocks array 
  }

  async sellStock(purchaseOptions: StockPurchase) {
    const {
      stockTicker,
      quantity,
      userName
    } = purchaseOptions;
    // get current value of stock
    const currentStockPrice = await this.getStockPriceVantage( stockTicker );
    const {
      name,
      username,
      userId,
      stocksOwned,
      cashValue
    } = await this.dbService.getUserInfo(userName);
    // check to see if the user has enough money

    const stocksOwnedJson = JSON.parse( stocksOwned ).find( el => el.ticker === stockTicker );
    if( stocksOwnedJson && stocksOwnedJson.quantity >= quantity ) {
      // Push new transaction
      return this.dbService.runSaleTransaction( { 
        quantity, 
        timestamp: moment().toISOString(), 
        authorizingUserId: userId,
        purchasePrice:currentStockPrice,
        tickerSymbol:stockTicker 
      }).then( () => {
        return this.dbService.getAccountEvaluation( username, stockTicker, currentStockPrice );
      });

      // Update user file
    }
    else {
      throw new Error( 'User does not have enough stock holdings to sell.' );
    }
    // if no, throw you are poor exception
    // if yes, update the stocks array 
  }
}
