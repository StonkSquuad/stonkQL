import {
  ApolloClient,
  ApolloProvider,
  DefaultOptions,
  InMemoryCache,
} from '@apollo/client';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Nav from './components/nav/nav';
import Home from './pages/home/home';
import Login from './pages/login/login';
import Stonk from './pages/stonk/stonk';

export function App() {
  const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  };

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'http://localhost:3333/graphql',
    defaultOptions: defaultOptions,
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
