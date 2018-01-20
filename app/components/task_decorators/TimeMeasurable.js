import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import ActionBuild from 'material-ui/svg-icons/action/build';
import moment from 'moment';

const TimeFormat = 'h:mm:ss a';
export default function TimeMeasurable(TaskComponent) {
  return class extends Component {
    static propTypes = TaskComponent.propTypes;

    constructor(props) {
      super(props);
      this.handleStartTask = this.handleStartTask.bind(this);
      this.handleStopTask = this.handleStopTask.bind(this);
    }

    handleStartTask() {
      this.props.updateTask(
        // NOTE: better to delegate Task Class??
        this.props.task.indexPath,
        {
          startTime: moment().format(TimeFormat),
          complete: false
        }
      );
    }

    handleStopTask() {
      this.props.updateTask(
        this.props.task.indexPath,
        {
          endTime: moment().format(TimeFormat),
          complete: false
        }
      );
    }

    render() {
      return (
        <div>
          <div>{this.props.task.startTime || 'start time here'}</div>
          <div>{this.props.task.endTime || 'end time here'}</div>
          <TaskComponent {...this.props} />
          <MuiThemeProvider>
            <FloatingActionButton
              mini
              onClick={this.handleStartTask}
            >
              <ActionBuild />
            </FloatingActionButton>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <FloatingActionButton
              mini
              onClick={this.handleStopTask}
            >
              <ActionBuild />
            </FloatingActionButton>
          </MuiThemeProvider>
        </div>
      );
    }
  };
}
