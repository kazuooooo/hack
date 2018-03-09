import { ADD_TASK, START_TASK, END_TASK, UPDATE_TASK, DELETE_TASK, UPDATE_TASKS_STATE } from '../actions/tasks';
import { addNodeUnderParent, removeNode, changeNodeAtPath, walk } from '../components/vendor/tree-data-utils';
import { defaultGetNodeKey } from '../components/vendor/default-handlers';

const defaultState = {
  treeData: [{
    title: '', active: true, complete: false, expanded: true, children: []
  }],
  treeIndex: 0
};
export default function tasks(tasksState = defaultState, action) {
  switch (action.type) {
    case ADD_TASK: {
      const newState = addNodeUnderParent({
        treeData: tasksState.treeData,
        newNode: action.taskObject,
        parentKey: action.parentNode ? defaultGetNodeKey(action.parentNode) : undefined,
        getNodeKey: defaultGetNodeKey
      });
      return persistAndReturnState(Object.assign({}, newState));
    }
    case UPDATE_TASK: {
      let newState;

      if (action.params.active) {
        newState = deactiveAllTasks(tasksState, action.path);
      }

      const newNode = Object.assign(action.node, action.params);
      newState = changeNodeAtPath({
        treeData: tasksState.treeData,
        path: action.path,
        newNode,
        getNodeKey: defaultGetNodeKey
      });
      return persistAndReturnState(Object.assign({}, { treeData: newState }));
    }
    case DELETE_TASK: {
      const newState = removeNode({
        treeData: tasksState.treeData,
        path: action.path,
        getNodeKey: defaultGetNodeKey
      });
      return persistAndReturnState(Object.assign({}, newState));
    }
    case START_TASK: {
      updateTask(tasksState, action.indexPath, action.startTime);
      return persistAndReturnState(Object.assign({}, tasksState));
    }
    case END_TASK: {
      updateTask(tasksState, action.indexPath, action.endTime);
      return persistAndReturnState(Object.assign({}, tasksState));
    }
    case UPDATE_TASKS_STATE: {
      return persistAndReturnState(Object.assign({}, { treeData: action.newState }));
    }
    default:
      return tasksState;
  }
}

function updateTask(tasksState, indexPath, params) {
  const task = getTask(tasksState, indexPath);
  Object.assign(task, params);
}

function getTask(tasksState, indexPath) {
  const reducer = (currentTask, index) => currentTask.children[index];
  return indexPath.reduce(reducer, tasksState);
}

function persistAndReturnState(state) {
  localStorage.state = JSON.stringify({ tasks: state });
  return state;
}

function deactiveAllTasks(tasksState, path) {
  let newState;
  walk({
    treeData: tasksState.treeData,
    getNodeKey: defaultGetNodeKey,
    callback: (node) => {
      if (node.node.active) {
        const deactiveNode = Object.assign(node.node, { active: false });
        newState = changeNodeAtPath({
          treeData: tasksState.treeData,
          path,
          deactiveNode,
          getNodeKey: defaultGetNodeKey
        });
      }
    }
  });
  return newState;
}
