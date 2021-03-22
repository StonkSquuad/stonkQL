
import { Args, Query, Resolver } from '@nestjs/graphql';
import { StockHistoricalData } from './models/stock-historical-data.model';
import { Stock } from './models/stock.model';
import { User } from './models/user.model';
import { StockService } from './stock.service';


@Resolver()
export class StockResolver {

  constructor(
    private readonly stockService: StockService
  ) {}

  @Query(returns => [Stock], { name: 'stock' })
  async getStockPrice(@Args('stockTicker') stockTicker: string) {
    return this.stockService.getStock(stockTicker);
  }

  @Query(returns => User, { name: 'user' })
  async getUserInfo(@Args('username') username: string) {
    return this.stockService.getUserInfo(username);
  }

  @Query(returns => [StockHistoricalData], { name: 'stockHistorical' })
  async getStockHistorical(
    @Args('stockTicker') stockTicker: string,
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string) {
    return this.stockService.getStockHistorical({
      stockTicker,
      startDate,
      endDate
    });
  }
}
