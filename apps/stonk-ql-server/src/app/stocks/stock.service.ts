import { HttpService, Injectable } from '@nestjs/common';
import * as moment from 'moment';
//import * as mongodb from 'mongodb';

interface HistoricalStockOptions {
    stockTicker: string;
    startDate: string;
    endDate: string;
}

@Injectable()
export class StockService {
  private static readonly BASE_URL = `https://api.polygon.io/v2`;

  constructor(private readonly httpService: HttpService) {}

  async getStock( ticker: string ): Promise<any> {
    return this.httpService.get('/reference/tickers', {
      baseURL: StockService.BASE_URL,
      params: {
        perpage: 100,
        page: 1,
        apiKey: process.env.POLYGON_API_KEY,
        search: ticker,
        sort: 'ticker'
      }
    })
    .toPromise()
    .then( (response) =>response.data.tickers)
    .catch( (error) => {
        console.log(error);
    });
  }

  async getStockHistorical( historicalStockOptions: HistoricalStockOptions ): Promise<any> {
      const {
          stockTicker,
          startDate,
          endDate
      } = historicalStockOptions;

    return this.httpService.get(`/aggs/ticker/${stockTicker}/range/1/day/${moment(startDate).format('YYYY-MM-DD')}/${moment(endDate).format('YYYY-MM-DD')}`, {
      baseURL: StockService.BASE_URL,
      params: {
        unadjusted: true,
        sort: 'asc',
        limit: 120,
        apiKey: process.env.POLYGON_API_KEY
      }
    })
    .toPromise()
    .then((response) => response.data.results.map( ( result ) => ({ date: moment(result.t).toISOString(), close: result.c })))
    .catch((error) => {
        // handle error
        console.log(error);
    });
  }

  /*async getUserInfo( userName: string ): Promise<any> {
    return new Promise( ( resolve ) => {
        const MongoClient = mongodb.MongoClient;
        const client = new MongoClient(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
        const collection = client.db("stock-database").collection("stockusers");
        collection.find( { username: userName } ).then( ( result ) => {
            console.log( result );
            resolve( {} );
        });
        // perform actions on the collection object
        client.close();
        });
    });
  }*/
}
