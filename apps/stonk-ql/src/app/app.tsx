import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';

export function App() {
  return (
    <Switch>
      <Route path="/login" exact>
        <Login />
      </Route>
      <Route path="/" exact>
        <Home />
      </Route>
    </Switch>
  );
}

export default App;
