import { Injectable } from '@nestjs/common';
import { Stock } from './interfaces/stock.interface';

@Injectable()
export class StockService {
  private stocks: Partial<Stock>[] = [
    { id: 0, companyName: 'Tesla', price: 124.23 },
    { id: 1, companyName: 'Apple', price: 42.98 },
    { id: 2, companyName: 'Amazon', price: 69.19 }
  ];

  getStock( companyName: string ): Stock {
    for( let i=0; i < this.stocks.length; i++ ) {
        if( this.stocks[i].companyName === companyName ) {
            return this.stocks[i] as Stock;
        }
    }
    return { id: null, companyName: null, price: null };
  }
}