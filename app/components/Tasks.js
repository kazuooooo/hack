//http://www.material-ui.com/
import React, { Component } from 'react';
import Task from './Task'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';import ContentAdd from 'material-ui/svg-icons/content/add';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import styles from './Tasks.css';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';

class Tasks extends Component {

  constructor(props) {
    super(props)
    this.state = {text: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleAddRootTask = this.handleAddRootTask.bind(this);
  }

  // handleSubmit(){
  //   this.props.addTask(this.state.text)
  //   event.preventDefault();
  // }

  handleChange(event){
    this.setState({text: event.target.value});
  }

  handleAddRootTask(event){
    this.props.addTask(null, {text: '', active: true, complete: false}) //TODO: extract as task default
  }

  render() {
    let tasks = []
    for (var i = 0; i < this.props.tasks.child_tasks.length; i++) {
      let task = this.props.tasks.child_tasks[i]
      if(task != null){
        tasks.push(
          <Task
            key={i}
            addTask={this.props.addTask}
            updateTask={this.props.updateTask}
            deleteTask={this.props.deleteTask}
            task={task}>
          </Task>);
      }
    }

    return (
      <div>
        <MuiThemeProvider>
          <List className={Tasks.taskWrapper}>
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
export default Tasks;
