import {
  ApolloClient,
  ApolloProvider,
  defaultDataIdFromObject,
  InMemoryCache,
} from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';

const cache = new InMemoryCache({
  dataIdFromObject(responseObject) {
    switch (responseObject.__typename) {
      case 'Stock':
        return `Stock:${responseObject.name}`;
      case 'StockHistoricalData':
        return `StockHistorical:${responseObject.ticker}:${responseObject.date}`;
      default:
        return defaultDataIdFromObject(responseObject);
    }
  },
});

const client = new ApolloClient({
  uri: 'http://localhost:3333/graphql',
  cache,
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
