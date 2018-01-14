import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentDeleteSweep from 'material-ui/svg-icons/content/delete-sweep';
import TextField from 'material-ui/TextField/TextField';
import Checkbox from 'material-ui/Checkbox/Checkbox';
import PropTypes from 'prop-types';

import TimeMeasurable from './task_decorators/TimeMeasurable';
import Octcatable from './task_decorators/Octcatable';

import styles from './Task.css';

class Task extends Component {
  static propTypes = {
    addTask: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    task: PropTypes.shape({
      text: PropTypes.string,
      indexPath: PropTypes.arrayOf(PropTypes.number),
      active: PropTypes.bool,
      complete: PropTypes.bool,
      childTasks: PropTypes.array
    })
  };

  static defaultProps = {
    task: []
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddChildTask = this.handleAddChildTask.bind(this);
    this.saveTask = this.saveTask.bind(this);
    this.calcMarginLeft = this.calcMarginLeft.bind(this);
    this.editTask = this.editTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.switchTaskActive = this.switchTaskActive.bind(this);
    this.state = { text: props.task.text, paddingLeft: this.calcMarginLeft() };
  }

  handleAddChildTask() {
    const indexPath = this.props.task.indexPath;
    const parentIndexPath = indexPath.slice(0, indexPath.length);
    this.props.addTask(parentIndexPath, { text: '', active: true, complete: false });
    event.preventDefault();
  }

  handleChange(event) {
    // TODO: reducerで処理する??
    this.setState({ text: event.target.value });
  }

  saveTask() {
    const params = { text: this.state.text, active: false };
    this.props.updateTask(this.props.task.indexPath, params);
  }

  editTask() {
    this.props.updateTask(this.props.task.indexPath, { active: true });
  }

  switchTaskActive() {
    this.props.updateTask(this.props.task.indexPath, { complete: !this.props.task.complete });
  }

  deleteTask() {
    this.props.deleteTask(this.props.task.indexPath);
  }

  calcMarginLeft() {
    return this.props.task.indexPath.length * 24;
  }

  render() {
    let contextDom = (
      <div className={styles.task} style={{ paddingLeft: `${this.state.paddingLeft}px` }}>
        <Checkbox
          className={styles.checkbox}
          checked={this.props.task.complete}
          onCheck={this.switchTaskActive}
        />
        <div
          onClick={this.editTask}
          className={styles.taskText}
          role="button"
          tabIndex={0} // TODO: check
        >
          {this.state.text}
        </div>
        <MuiThemeProvider>
          <FloatingActionButton
            mini
            backgroundColor="#d10000"
            onClick={this.deleteTask}
          >
            <ContentDeleteSweep />
          </FloatingActionButton>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <FloatingActionButton
            mini
            onClick={this.handleAddChildTask}
          >
            <ContentAdd />
          </FloatingActionButton>
        </MuiThemeProvider>
      </div>
      );

    if (this.props.task.active) {
      contextDom = (
        <div className={styles.task} style={{ paddingLeft: `${this.state.paddingLeft}px` }}>
          <label htmlFor="task-text-field">
            <MuiThemeProvider>
              <TextField
                name="task"
                value={this.state.text}
                onChange={this.handleChange}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    this.saveTask();
                  }
                }}
              />
            </MuiThemeProvider>
          </label>
        </div>
      );
    }

    return (
      <div>
        { contextDom }
      </div>
    );
  }
}
// TODO: control decoration with setting
export default Octcatable(TimeMeasurable(Task));
// export default TimeMeasurable(Task);
