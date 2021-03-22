import { Module } from '@nestjs/common';
import { StockService } from './stock.service';

@Module({
  controllers: [],
  providers: [StockService],
  exports: [StockService]
})
export class StockModule {}