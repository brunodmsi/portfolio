import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import Home from '../pages/Home';

const Routes: React.FC = () => (
  <Switch>
    <Route component={Home} path="/" exact />
  </Switch>
);

export default Routes;
