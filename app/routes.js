import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import TasksPage from './containers/TasksPage';

export default () => (
  <App>
    <Switch>
      <Route exact path="/" component={TasksPage} />
    </Switch>
  </App>
);
