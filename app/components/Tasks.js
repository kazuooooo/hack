// http://www.material-ui.com/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { MuiThemeProvider } from 'material-ui/styles';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SortableTree from 'react-sortable-tree';
import styles from './Tasks.css';
import Task from '../components/Task';

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleAddRootTask = this.handleAddRootTask.bind(this);
  }

  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  // TOOD: この処理は切り出せる
  // presentation component
  handleAddRootTask() {
    this.props.addTask(
      null,
      {
        title: '',
        active: true,
        complete: false,
        expanded: true,
        children: []
      }
    );
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div style={{ height: 1000 }}>
            <SortableTree
              treeData={this.props.tasks.treeData}
              onChange={newState => this.props.updateTasksState(newState)}
              nodeContentRenderer={Task}
              generateNodeProps={() => {
                return {
                  actions: {
                    addTask: this.props.addTask,
                    deleteTask: this.props.deleteTask,
                    updateTask: this.props.updateTask
                  }
                };
              }}
            />
          </div>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <FloatingActionButton
            onClick={this.handleAddRootTask}
            className={styles.addRootTaskButton}
          >
            <ContentAdd />
          </FloatingActionButton>
        </MuiThemeProvider>
      </div>
    );
  }
}
Tasks.propTypes = {
  addTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  updateTasksState: PropTypes.func.isRequired,
  tasks: PropTypes.object.isRequired
};

export default Tasks;
