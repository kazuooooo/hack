// http://www.material-ui.com/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { MuiThemeProvider } from 'material-ui/styles';
import ContentAdd from 'material-ui/svg-icons/content/add';
import styles from './Tasks.css';


import Task from './Task';

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleAddRootTask = this.handleAddRootTask.bind(this);
  }

  // handleSubmit(){
  //   this.props.addTask(this.state.text)
  //   event.preventDefault();
  // }

  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  handleAddRootTask() {
    this.props.addTask(
      null,
      {
        text: '',
        active: true,
        complete: false
      }
    );
  }

  render() {
    const tasks = [];
    const rootTasks = this.props.tasks.childTasks;
    for (let i = 0; i < rootTasks.length; i += 1) {
      const task = rootTasks[i];
      if (task != null) {
        tasks.push(
          <Task
            key={i}
            addTask={this.props.addTask}
            updateTask={this.props.updateTask}
            deleteTask={this.props.deleteTask}
            task={task}
          />);
      }
    }
    return (
      <div>
        <MuiThemeProvider>
          <List className={styles.taskWrapper}>
            {tasks}
          </List>
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
  tasks: PropTypes.object.isRequired
};

export default Tasks;
