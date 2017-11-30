//http://www.material-ui.com/
import React, { Component } from 'react';
import Task from './Task'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ContentAdd from 'material-ui/svg-icons/content/add';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';

class Tasks extends Component {

  constructor(props) {
    super(props)
    this.state = {text: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(){
    this.props.addTask(this.state.text)
    event.preventDefault();
  }

  handleChange(event){
    this.setState({text: event.target.value});
  }

  render() {

    let tasks = []
    for (var i = 0; i < this.props.tasks.length; i++) {
      tasks.push(<Task text={this.props.tasks[i]}></Task>);
    }

    return (
      <div>
        <MuiThemeProvider>
          <List>
            {tasks}
          </List>
        </MuiThemeProvider>
        <label>
          <MuiThemeProvider>
            <TextField value={this.state.text} name="task"onChange={this.handleChange}>
            </TextField>
          </MuiThemeProvider>
        </label>
        <MuiThemeProvider>
          <FloatingActionButton
            onClick={this.handleSubmit}>
            <ContentAdd />
          </FloatingActionButton>
        </MuiThemeProvider>
      </div>
    );
  }
}
export default Tasks;
