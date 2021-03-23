import { Inject, Injectable } from "@nestjs/common";
import { MongoClient } from "mongodb";
import { MONGO_CLIENT } from "../constants";

interface TransactionOptions {
  readonly quantity: number;
  readonly timestamp: string;
  readonly authorizingUserId: number;
  readonly purchasePrice: number;
  readonly tickerSymbol: string;
}

interface UserEntry {
  readonly name?: string;
  readonly username?: string;
  readonly cashValue?: number;
  readonly userId?: number;
  readonly stocksOwned?: string;
}
@Injectable()
export class DbService {

  constructor(@Inject(MONGO_CLIENT) private readonly mongoClient: Promise<MongoClient>) {}

  async getUserInfo(userName: string): Promise<any> {
    const client = await this.mongoClient;
    const database = client.db('stock-database');
    const userCollection = database.collection('stockusers');

    const query = { username: userName };

    return userCollection.findOne( query, {} );
  }

  async getOwnedStock( userName: string ): Promise<any> {
    const { stocksOwned } = await this.getUserInfo( userName );
    return JSON.parse( stocksOwned );
  };

  async getAccountEvaluation( userName: string, currentTicker: string, currentTickerPrice: number ): Promise<any> {
    const { stocksOwned, cashValue } = await this.getUserInfo( userName );
    const stocksOwnedJson = JSON.parse( stocksOwned ) || [];

    const {
      quantity 
    } = stocksOwnedJson.find( el => el.ticker === currentTicker );

    return {
      ticker: currentTicker,
      totalStockValue: quantity*currentTickerPrice,
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

      return userCollection.find({
        userId: authorizingUserId
      }).toArray(function (err, result) {
        const [user] = result;
        const { 
          userId,
          stocksOwned,
          cashValue
        } = user as UserEntry;
        // Insert transaction to transactions collection
        return transactionsCollection.insertOne(transactionOptions, function(err, res) {
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
              cashValue: cashValue - purchasePrice*quantity
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

    return userCollection.find({
      userId: authorizingUserId
    }).toArray(function (err, result) {
      const [user] = result;
      const { 
        userId,
        stocksOwned,
        cashValue
      } = user as UserEntry;
      // Insert transaction to transactions collection
      return transactionsCollection.insertOne(transactionOptions, function(err, res) {
        if (err) throw err;
        // Update user collection stocks owned and such
        let stocksOwnedJson = JSON.parse( stocksOwned ) || [];
        const prevOwnedStock = stocksOwnedJson.find( ( el ) => el.ticker === tickerSymbol);
        const otherStock = stocksOwnedJson.filter( ( el ) => el.ticker !== tickerSymbol);

         if( prevOwnedStock ) {      
           prevOwnedStock.quantity -= quantity;

           if( ( prevOwnedStock.quantity - quantity ) > 0 ) {
            otherStock.push( prevOwnedStock ); 
            stocksOwnedJson = otherStock;
           } else {
            stocksOwnedJson = otherStock;
           }
         }
        userCollection.updateOne( {userId: authorizingUserId },{
          $set: { 
            stocksOwned: JSON.stringify( stocksOwnedJson ),
            cashValue: cashValue + purchasePrice*quantity
          } 
        },(err,res)=>{
          if(err)throw err;
          transactionComplete( res );
          return res;
        });    
      });
    });
    });
  };
}
