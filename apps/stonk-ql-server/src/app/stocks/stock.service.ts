import { Injectable } from '@nestjs/common';
import axios from 'axios';
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
}