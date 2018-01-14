import { ADD_TASK, START_TASK, END_TASK, UPDATE_TASK, DELETE_TASK } from '../actions/tasks';

export default function tasks(tasksState = { childTasks: [] }, action) {
  switch (action.type) {
    case ADD_TASK: {
      const task = action.taskObject;
      task.childTasks = [];

      if (action.parentIndexPath === null) {
        task.indexPath = [tasksState.childTasks.length];
        tasksState.childTasks.push(task);
        return persistAndReturnState(Object.assign({}, tasksState));
      }

      const parentTask = getTask(tasksState, action.parentIndexPath);
      const selfIndex = parentTask.childTasks.length;

      // set self index path
      task.indexPath = action.parentIndexPath.concat(selfIndex);

      // add self to parent child task
      parentTask.childTasks.push(task);
      return persistAndReturnState(Object.assign({}, tasksState));
    }
    case UPDATE_TASK: {
      updateTask(tasksState, action.indexPath, action.params);
      return persistAndReturnState(Object.assign({}, tasksState));
    }
    case DELETE_TASK: {
      deleteTask(tasksState, action.indexPath);
      return persistAndReturnState(Object.assign({}, tasksState));
    }
    case START_TASK: {
      return tasksState;
    }
    case END_TASK: {
      return tasksState;
    }
    default:
      return tasksState;
  }
}

function updateTask(tasksState, indexPath, params) {
  const task = getTask(tasksState, indexPath);
  Object.assign(task, params);
}

function deleteTask(tasksState, indexPath) {
  const parentTask = getTask(tasksState, getParenPath(indexPath));
  const indexInParent = indexPath.slice(-1);
  parentTask.childTasks[indexInParent] = null;
}

function getTask(tasksState, indexPath) {
  const reducer = (currentTask, index) => currentTask.childTasks[index];
  return indexPath.reduce(reducer, tasksState);
}

function getParenPath(indexPath) {
  return indexPath.slice(0, indexPath.length - 1);
}

function persistAndReturnState(state) {
  localStorage.state = JSON.stringify({ tasks: state });
  return state;
}
