import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as moment from 'moment';

interface HistoricalStockOptions {
    stockTicker: string;
    startDate: string;
    endDate: string;
}

@Injectable()
export class StockService {
  private BASE_URL = `https://api.polygon.io/v2`;

  async getStock( ticker: string ): Promise<any> {
    return axios.get(`${this.BASE_URL}/reference/tickers?sort=ticker&search=${ticker}&perpage=50&page=1&apiKey=${process.env.POLYGON_API_KEY}`)
    .then(function (response) {
        // handle success
        return response.data.tickers;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
  }

  async getStockHistorical( historicalStockOptions: HistoricalStockOptions ): Promise<any> {
      const {
          stockTicker,
          startDate,
          endDate
      } = historicalStockOptions;

    return axios.get(`${this.BASE_URL}/aggs/ticker/${stockTicker}/range/1/day/${moment(startDate).format('YYYY-MM-DD')}/${moment(endDate).format('YYYY-MM-DD')}?unadjusted=true&sort=asc&limit=120&apiKey=${process.env.POLYGON_API_KEY}`)
    .then(function (response) {
        // handle success
        const result = response.data.results;
        return result.map( ( o ) => {
            return { date: o.t, close: o.c };
        });
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
  }
}
