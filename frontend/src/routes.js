import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute/PrivateRoute';

import Login from './pages/Login';
import Main from './pages/Main';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute path="/" exact component={Main} />
        <Route path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}
