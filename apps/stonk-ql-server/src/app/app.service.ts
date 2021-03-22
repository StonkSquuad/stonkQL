
import { Args, Query, Resolver } from '@nestjs/graphql';
import { StockHistoricalData } from './stocks/models/stock-historical-data.model';
import { Stock } from './stocks/models/stock.model';
import { StockService } from './stocks/stock.service';
@Resolver()
export class StockResolver {

  constructor(
    private stockService: StockService
  ) {}

  @Query(returns => Stock, { name: 'stock' })
  async getStockPrice(@Args('stockTicker') stockTicker: string) {
    return await this.stockService.getStock(stockTicker);
  }

  @Query(returns => StockHistoricalData, { name: 'stockHistorical'})
  getStockHistoricalData(@Args('stockTicker') stockTicker: string, @Args('from') from: string, @Args('to') to: string) {
    return this.stockService.getHistoryStockData(stockTicker, from, to);
  }
}
