// @flow
import { ADD_TASK, START_TASK, END_TASK } from '../actions/tasks';

export default function tasks(tasks = [], action) {
  switch (action.type) {
    case ADD_TASK:
      return Object.assign([], tasks, tasks.push(action.text))
    case START_TASK:
      return tasks;
    case END_TASK:
      return tasks;
    default:
      return tasks;
  }
}
