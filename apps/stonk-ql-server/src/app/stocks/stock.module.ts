import { HttpModule, Module } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { MONGO_CLIENT } from './constants';
import { DbService } from './db/db.service';
import { StockResolver } from './stock.resolver';
import { StockService } from './stock.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [
    StockService,
    StockResolver,
    DbService,
    {
      provide: MONGO_CLIENT,
      useFactory: async () => {
        const client = new MongoClient(process.env.MONGO_CONNECTION_STRING, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        return await client.connect();
      },
    },
  ],
  exports: [StockResolver],
})
export class StockModule {}
