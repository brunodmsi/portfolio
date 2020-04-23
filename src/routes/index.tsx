import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import Home from '../pages/Home';
import Contact from '../pages/Contact';
import About from '../pages/About';

const Routes: React.FC = () => (
  <Switch>
    <Route component={Home} path="/" exact />
    <Route component={Contact} path="/contact" />
    <Route component={About} path="/about" />
  </Switch>
);

export default Routes;
