import { Inject, Injectable } from "@nestjs/common";
import { MongoClient } from "mongodb";
import { MONGO_CLIENT } from "../constants";

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
}
