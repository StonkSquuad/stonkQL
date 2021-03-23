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

  async runTransaction( transactionOptions: TransactionOptions ): Promise<any> {
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
    const userCollection = database.collection('stockUsers');

    console.log('AuthId: ', authorizingUserId );

    const userInformation = await userCollection.find( {
      userId: authorizingUserId
    } ).toArray(function(err, result) {
      if (err) throw err;
      console.log( 'RESULT: ', result );
      return result;
    });

    console.log( 'UserInformation: ', userInformation );

    return Promise.resolve( {} );


    /*const transactionRequest = transactionsCollection.insertOne(transactionOptions, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
    });

    const userRequest = userCollection.updateOne( {userId: authorizingUserId },{
      $set: { } 
    },()=>{});*/
  };
}
