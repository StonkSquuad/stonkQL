import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { StockModule } from './stocks/stock.module';



@Module({
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      playground: true,
      debug: true,
      include: []
    }),
    StockModule
  ],
})
export class AppModule {}
