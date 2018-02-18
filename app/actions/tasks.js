export const ADD_TASK = 'ADD_TASK';
export const START_TASK = 'START_TASK';
export const END_TASK = 'END_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const EDIT_TASK = 'EDIT_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const UPDATE_TASKS_STATE = 'UPDATE_TASKS_STATE';

export function addTask(parentNode, taskObject) {
  return {
    type: ADD_TASK,
    parentNode,
    taskObject
  };
}

export function startTask(indexPath, startTime) {
  return {
    type: START_TASK,
    indexPath,
    startTime
  };
}

export function endTask(indexPath, endTime) {
  return {
    type: END_TASK,
    indexPath,
    endTime
  };
}

export function updateTask(node, path, params) {
  return {
    type: UPDATE_TASK,
    node,
    path,
    params
  };
}

export function updateTasksState(newState) {
  return {
    type: UPDATE_TASKS_STATE,
    newState
  };
}

export function deleteTask(path) {
  return {
    type: DELETE_TASK,
    path
  };
}
