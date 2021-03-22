import { Injectable } from "@nestjs/common";
const { MongoClient } = require("mongodb");

@Injectable()
export class DbService {
  static getUserInfo(userName: string): any {
       return new Promise( ( resolve ) => {
       const client = new MongoClient(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
       client.connect(err => {
         const database = client.db('stock-database');
         const userCollection = database.collection('stockusers');

         const query = { username: userName };

         const queryResult = userCollection.findOne( query, {} );

         queryResult.then( ( userData ) => {
           resolve( userData );
           client.close();
         });
       });
     });
  }
}