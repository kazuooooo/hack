/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import TasksPage from './containers/TasksPage';

export default () => (
  <App>
    <Switch>
      <Route exact path="/counter" component={CounterPage} />
      <Route exact path="/" component={HomePage} />
      <Route exact path="/tasks" component={TasksPage} />
    </Switch>
  </App>
);
