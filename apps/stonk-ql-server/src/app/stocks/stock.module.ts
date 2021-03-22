import { HttpModule, Module } from '@nestjs/common';
import { StockResolver } from './stock.resolver';
import { StockService } from './stock.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [StockService, StockResolver],
  exports: [StockResolver]
})
export class StockModule {}
