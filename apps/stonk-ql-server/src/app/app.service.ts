
import { Args, Query, Resolver } from '@nestjs/graphql';
import { StockHistoricalData } from './stocks/models/stock-historical-data.model';
import { Stock } from './stocks/models/stock.model';
import { StockService } from './stocks/stock.service';
@Resolver()
export class StockResolver {

  constructor(
    private stockService: StockService
  ) {}

  @Query(returns => [Stock], { name: 'stock' })
  async getStockPrice(@Args('stockTicker') stockTicker: string) {
    return this.stockService.getStock(stockTicker);
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