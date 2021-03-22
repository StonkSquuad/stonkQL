
import { Post } from '@nestjs/common';
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Stock } from './stocks/models/stock.model';
import { StockService } from './stocks/stock.service';

@Resolver()
export class StockResolver {

  constructor(
    private stockService: StockService
  ) {}

  @Query(returns => Stock, { name: 'stock' })
  async getStockPrice(@Args('companyName') companyName: string) {
    console.log( 'Finding this name: ', companyName );
    return this.stockService.getStock(companyName);
  }
}
