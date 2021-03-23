import {
  ApolloClient,
  ApolloProvider,
  defaultDataIdFromObject,
  InMemoryCache,
} from '@apollo/client';
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Nav from './components/nav/nav';
import Home from './pages/home/home';
import Login from './pages/login/login';
import Stonk from './pages/stonk/stonk';

export function App() {
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

  persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
  });

  const client = new ApolloClient({
    cache,
    uri: 'http://localhost:3333/graphql',
  });

  return (
    <ApolloProvider client={client}>
      <Nav />
      <Switch>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/stonk" exact>
          <Stonk />
        </Route>
      </Switch>
    </ApolloProvider>
  );
}

export default App;
