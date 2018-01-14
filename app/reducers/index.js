// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import tasks from './tasks';

const rootReducer = combineReducers({
  counter,
  router,
  tasks
});

export default rootReducer;
