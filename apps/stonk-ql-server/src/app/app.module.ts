import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { StockResolver } from './app.service';
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
  providers: [StockResolver],
})
export class AppModule {}
