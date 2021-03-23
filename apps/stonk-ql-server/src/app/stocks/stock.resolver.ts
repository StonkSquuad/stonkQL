import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StockHistoricalData } from './models/stock-historical-data.model';
import { Stock } from './models/stock.model';
import { TransactionHistoricalData } from './models/transaction-historical-data.model';
import { Transaction } from './models/transaction.model';
import { User } from './models/user.model';
import { StockService } from './stock.service';

@Resolver()
export class StockResolver {
  constructor(private readonly stockService: StockService) {}

  @Query((returns) => [Stock], { name: 'stock' })
  async getStockPrice(@Args('stockTicker') stockTicker: string) {
    return this.stockService.getStock(stockTicker);
  }

  @Query((returns) => User, { name: 'user' })
  async getUserInfo(@Args('username') username: string) {
    return this.stockService.getUserInfo(username);
  }

  @Query((returns) => [StockHistoricalData], { name: 'stockHistorical' })
  async getStockHistorical(
    @Args('stockTicker') stockTicker: string,
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string
  ) {
    return this.stockService.getStockHistorical({
      stockTicker,
      startDate,
      endDate,
    });
  }

  @Query((returns) => Transaction, { name: 'buyStock' })
  async buyStock(
    @Args('stockTicker') stockTicker: string,
    @Args('quantity') quantity: number,
    @Args('userName') userName: string,
  ) {
    return this.stockService.buyStock({
      stockTicker,
      quantity,
      userName
    });
  }

  @Query((returns) => Transaction, { name: 'sellStock' })
  async sellStock(
    @Args('stockTicker') stockTicker: string,
    @Args('quantity') quantity: number,
    @Args('userName') userName: string,
  ) {
    return this.stockService.sellStock({
      stockTicker,
      quantity,
      userName
    });
  }

  @Query((returns) => [TransactionHistoricalData], { name: 'transactionHistory' })
  async getTransactionHistory(
    @Args('userName') userName: string,
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string
  ) {
    return this.stockService.getTransactionHistory(
      {
        userName,
        startDate,
        endDate,
      }
    );
  }

  @Query((returns) => [Stock], { name: 'getOwnedStocks' })
  async getOwnedStock(
    @Args('userName') userName: string,
  ) {
    return this.stockService.getOwnedStock(
      userName
    );
  }


}
