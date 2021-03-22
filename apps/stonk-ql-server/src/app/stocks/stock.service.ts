import { Injectable } from '@nestjs/common';
import { Stock } from './interfaces/stock.interface';
import { restClient } from "polygon.io";

@Injectable()
export class StockService {
  private restClient = restClient(process.env.POLYGON_API_KEY);

  async getStock( ticker: string ): Promise<any> {
    return this.restClient.stocks.previousClose( ticker );
  }
}