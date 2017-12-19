// @flow
import React, {Component} from 'react';
import Timer from './Timer'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentDeleteSweep from 'material-ui/svg-icons/content/delete-sweep'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';
import Toggle from 'material-ui/Toggle';
import styles from './Task.css'

class Task extends Component {

  constructor(props) {
    super(props)
    this.handleChange       = this.handleChange.bind(this);
    this.handleAddChildTask = this.handleAddChildTask.bind(this);
    this.saveTask           = this.saveTask.bind(this);
    this.calcMarginLeft     = this.calcMarginLeft.bind(this);
    this.editTask           = this.editTask.bind(this);
    this.switchCompleteTask = this.switchCompleteTask.bind(this);
    this.deleteTask         = this.deleteTask.bind(this);
    this.state = {text: props.task.text, paddingLeft: this.calcMarginLeft()};
  }

  handleAddChildTask(event) {
    let index_path        = this.props.task.index_path
    // TODO: parent_index は不要.
    // reducerで処理する
    let parent_index_path = index_path.slice(0, index_path.length)
    this.props.addTask(parent_index_path, {text: '', active: true, complete: false})
    event.preventDefault();
  }

  handleChange(event) {
    // TODO: reducerで処理する??
    this.setState({text: event.target.value});
  }

  saveTask() {
    let params = {text: this.state.text, active: false}
    this.props.updateTask(this.props.task.index_path, params)
  }

  editTask() {
    this.props.updateTask(this.props.task.index_path, {active: true})
  }

  switchCompleteTask(){
    this.props.updateTask(this.props.task.index_path, {complete: !this.props.task.complete})
  }

  deleteTask(){
    this.props.deleteTask(this.props.task.index_path)
  }

  calcMarginLeft(){
    return this.props.task.index_path.length * 24;
  }

  render() {
    // TODO: css 切り出し
    let child_tasks = []
    for (var i = 0; i < this.props.task.child_tasks.length; i++) {
      let child_task = this.props.task.child_tasks[i]
      if(child_task != null) {
        child_tasks.push(
          <Task
            key={i}
            addTask={this.props.addTask}
            updateTask={this.props.updateTask}
            switchActiveTask={this.props.switchActiveTask}
            deleteTask={this.props.deleteTask}
            task={child_task}>
            >
          </Task>);
      }
    }

    let context_dom = (
      <div className={styles.task} style={{paddingLeft: this.state.paddingLeft + 'px' }}>
        <Checkbox className={styles.checkbox} checked={this.props.task.complete} onCheck={this.switchCompleteTask} />
        <div onClick={this.editTask} className={styles.taskText}>
          {this.state.text}
        </div>
        <MuiThemeProvider>
          <FloatingActionButton
            mini={true}
            backgroundColor="#d10000"
            onClick={this.deleteTask}>
            <ContentDeleteSweep />
          </FloatingActionButton>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <FloatingActionButton
            mini={true}
            onClick={this.handleAddChildTask}>
            <ContentAdd />
          </FloatingActionButton>
        </MuiThemeProvider>
      </div>
      )

    if (this.props.task.active) {
      context_dom = (
        <div className={styles.task} style={{paddingLeft: this.state.paddingLeft + 'px' }}>
          <label>
            <MuiThemeProvider>
              <TextField
                name="task"
                value={this.state.text}
                onChange={this.handleChange}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    this.saveTask()
                  }
                }}
              >
              </TextField>
            </MuiThemeProvider>
          </label>
        </div>
      )
    }


    return (
      <ListItem
        initiallyOpen={true}
        nestedItems={child_tasks}>
        {context_dom}
      </ListItem>
    );
  }
}
export default Task;
