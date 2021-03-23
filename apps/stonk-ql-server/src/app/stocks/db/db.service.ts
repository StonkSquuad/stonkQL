import { Inject, Injectable } from "@nestjs/common";
import * as moment from "moment";
import { MongoClient } from "mongodb";
import { MONGO_CLIENT } from "../constants";

interface TransactionOptions {
  readonly quantity: number;
  readonly timestamp: string;
  readonly authorizingUserId: number;
  readonly purchasePrice: number;
  readonly tickerSymbol: string;
  readonly purchaseType: string;
}

interface HistoricalStockOptions {
  stockTicker?: string;
  userName?: string;
  startDate: string;
  endDate: string;
}

interface UserEntry {
  readonly name?: string;
  readonly username?: string;
  readonly cashValue?: number;
  readonly userId?: number;
  readonly stocksOwned?: string;
  readonly stocksValue?: number;
}
@Injectable()
export class DbService {

  constructor(@Inject(MONGO_CLIENT) private readonly mongoClient: Promise<MongoClient>) {}

  async getUserInfo(userName: string): Promise<any> {
    const client = await this.mongoClient;
    const database = client.db('stock-database');
    const userCollection = database.collection('stockusers');

    const query = { username: userName };

    const result = await userCollection.findOne( query, {} );

    const stocksOwned = JSON.parse( result.stocksOwned ).map( o => o.ticker );

    return result;
  }

  async getOwnedStock( userName: string ): Promise<any> {
    const { stocksOwned } = await this.getUserInfo( userName );
    return JSON.parse( stocksOwned );
  };

  async getOwnedStockForTicker( userName: string, ticker:string ): Promise<any> {
    const client = await this.mongoClient;
    const database = client.db('stock-database');
    const userCollection = database.collection('stockusers');

    const query = { username: userName };

    const result = await userCollection.findOne( query, {} );

    const jsonResult = JSON.parse( result.stocksOwned );

    const [filterResult] = jsonResult.filter( o => o.ticker === ticker );
    return {
      stocksOwned: filterResult.quantity
    }; 
  };

  async getAccountEvaluation( userName: string, currentTicker: string, currentTickerPrice: number ): Promise<any> {
    const { stocksOwned, cashValue } = await this.getUserInfo( userName );
    const stocksOwnedJson = JSON.parse( stocksOwned ) || [];

    const {
      quantity
    } = ( stocksOwnedJson.find( el => el.ticker === currentTicker ) || [{quantity: 0}]);

    return {
      ticker: currentTicker,
      totalStockValue: ( quantity*currentTickerPrice ) || 0,
      totalCashValue: cashValue,
      currentPrice: currentTickerPrice
    };

  };

  async runPurchaseTransaction( transactionOptions: TransactionOptions ): Promise<any> {
    const client = await this.mongoClient;
    const database = client.db('stock-database');

    const transactionsCollection = database.collection('transactions');
    const userCollection = database.collection('stockusers');

    return new Promise( ( transactionComplete ) => {
      const {
        quantity,
        timestamp,
        authorizingUserId,
        purchasePrice,
        tickerSymbol,
      } = transactionOptions;

      userCollection.find({
        userId: authorizingUserId
      }).toArray(function (err, result) {
        const [user] = result;
        const { 
          userId,
          stocksOwned,
          cashValue,
          stocksValue
        } = user as UserEntry;
        // Insert transaction to transactions collection
        transactionsCollection.insertOne(Object.assign( transactionOptions,{purchaseType: 'buy'}) , function(err, res) {
          if (err) throw err;
          // Update user collection stocks owned and such
          let stocksOwnedJson = JSON.parse( stocksOwned ) || [];

          const prevOwnedStock = stocksOwnedJson.find( ( el ) => el.ticker === tickerSymbol);

          const otherStock = stocksOwnedJson.filter( ( el ) => el.ticker !== tickerSymbol) || [];

          if( prevOwnedStock ) {      
            prevOwnedStock.quantity += quantity;
            otherStock.push( prevOwnedStock );
            stocksOwnedJson = otherStock;
          }
          else {
            stocksOwnedJson.push( {
              ticker:tickerSymbol,
              quantity: quantity
            } );
          }
          userCollection.updateOne( {userId: authorizingUserId },{
            $set: { 
              stocksOwned: JSON.stringify( stocksOwnedJson ),
              cashValue: cashValue - purchasePrice*quantity,
              stocksValue: stocksValue + (purchasePrice*quantity)
            } 
          },(err,res)=>{
            if(err)throw err;
            transactionComplete( res );
          });    
        });
      });
    });
  };

  async runSaleTransaction( transactionOptions: TransactionOptions ): Promise<any> {
    const {
       quantity,
       timestamp,
       authorizingUserId,
       purchasePrice,
       tickerSymbol,
    } = transactionOptions;

    const client = await this.mongoClient;
    const database = client.db('stock-database');

    const transactionsCollection = database.collection('transactions');
    const userCollection = database.collection('stockusers');

    return new Promise( ( transactionComplete ) => {

    userCollection.find({
      userId: authorizingUserId
    }).toArray(function (err, result) {
      const [user] = result;
      const { 
        userId,
        stocksOwned,
        cashValue,
        stocksValue
      } = user as UserEntry;

      const transactionObject = Object.assign( transactionOptions,{purchaseType: 'sell'});

      // Insert transaction to transactions collection
      transactionsCollection.insertOne(transactionObject, function(err, res) {
        if (err) throw err;
        // Update user collection stocks owned and such
        let stocksOwnedJson = JSON.parse( stocksOwned ) || [];
        const prevOwnedStock = stocksOwnedJson.filter( ( el ) => el.ticker === tickerSymbol) || [];
        const otherStock = stocksOwnedJson.filter( ( el ) => el.ticker !== tickerSymbol ) || [];
        let newCashValue=0;

        prevOwnedStock[0].quantity -= quantity;
        newCashValue = cashValue + (purchasePrice*quantity)
        

        const filteredStock = JSON.stringify( prevOwnedStock.concat( otherStock ).filter( (el) => el.quantity > 0) );

        userCollection.updateOne( {userId: authorizingUserId },{
          $set: { 
            stocksOwned: filteredStock,
            cashValue: newCashValue,
            stocksValue: stocksValue - (purchasePrice*quantity)
          } 
        },(err,res)=>{
          if(err)throw err;
          transactionComplete( res );
        });    
      });
    });
    });
  };


  async getHistoricalTransactionData( options: HistoricalStockOptions ): Promise<any> {
    const { userName, startDate, endDate } = options;

    const client = await this.mongoClient;
    const database = client.db('stock-database');

    const transactionsCollection = database.collection('transactions');
    const userCollection = database.collection('stockusers');

    return new Promise( ( transactionComplete ) => {
      userCollection.find({
        username: userName
      }).toArray(function (err, result) {
        const [user] = result;
        const { 
          userId,
          stocksOwned,
          cashValue
        } = user as UserEntry;
        transactionsCollection.find( {
          authorizingUserId: userId
        } ).toArray( function( err, result ){
          if( err ) throw err;
            result.sort( ( a,b ) => { return moment(a.timestamp).format() > moment(b.timestamp).format() ? 1:-1; });
            transactionComplete( result );
        });
      });
    });
  }
}
