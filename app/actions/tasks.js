// @flow

type actionType = {
  +type: string
};

export const ADD_TASK   = 'ADD_TASK';
export const START_TASK = 'START_TASK';
export const END_TASK   = 'END_TASK';
export const UPDATE_TASK  = 'UPDATE_TASK';
export const EDIT_TASK  = 'EDIT_TASK';
export const DELETE_TASK = 'DELETE_TASK';

export function addTask(parent_index_path, task_object) {
  return {
    type: ADD_TASK,
    parent_index_path,
    task_object
  };
}

export function startTask() {
  return {
    type: START_TASK
  };
}

export function endTask(){
  return {
    type: END_TASK
  };
}

export function updateTask(index_path, params){
  return {
    type: UPDATE_TASK,
    index_path,
    params
  }
}

export function deleteTask(index_path){
  return {
    type: DELETE_TASK,
    index_path
  }
}
