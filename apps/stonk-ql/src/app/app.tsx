import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Nav from './components/nav/nav';
// import { useCtx } from './context';
import Home from './pages/home/home';
import Login from './pages/login/login';
import Stonk from './pages/stonk/stonk';

export function App() {
  // const {
  //   context: { isLoggedIn },
  // } = useCtx();
  // const history = useHistory();

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     history.push('/login');
  //   }
  // }, [history, isLoggedIn]);

  return (
    <>
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
    </>
  );
}

export default App;
