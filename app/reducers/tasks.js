// @flow
import { ADD_TASK, START_TASK, END_TASK, UPDATE_TASK, EDIT_TASK } from '../actions/tasks';

export default function tasks(tasks = {child_tasks: []}, action) {
  switch (action.type) {
    case ADD_TASK:
      action.task_object.child_tasks = []

      if(action.parent_index_path == null){
        action.task_object.index_path = [tasks.child_tasks.length]
        tasks.child_tasks.push(action.task_object)
        return Object.assign({}, tasks)
      }else{

        const parent_task = getTask(tasks, action.parent_index_path);
        let self_index = parent_task.child_tasks.length

        // set self index path
        action.task_object.index_path = action.parent_index_path.concat(self_index)

        // add self to parent child task
        parent_task.child_tasks.push(action.task_object)
        return Object.assign({}, tasks)
      }
    case UPDATE_TASK:
      updateTask(tasks, action.index_path, action.params)
      return Object.assign({}, tasks)
    case START_TASK:
      return tasks;
    case END_TASK:
      return tasks;
    default:
      return tasks;
  }
}

function updateTask(tasks, index_path, params){
  let task = getTask(tasks, index_path)
  Object.assign(task, params)
}

function getTask(tasks, index_path) {
  const reducer = (current_task, index) => {
    return current_task.child_tasks[index]
  };
  return index_path.reduce(reducer, tasks)
}
