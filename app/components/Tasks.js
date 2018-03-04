// http://www.material-ui.com/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { MuiThemeProvider } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MenuItem from 'material-ui/MenuItem';
import SortableTree from 'react-sortable-tree';
import styles from './Tasks.css';
import Task from '../components/Task';

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '', drawerOpen: false };
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

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });

  handleClose = () => this.setState({ drawerOpen: false });
  handleImportFile = () => {
    const { dialog } = require('electron').remote;
    // FixMe currently electorn deialog can't use extensions only
    // https://github.com/electron/electron/issues/11391
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'test', extensions: ['json'] }
      ]
    }, (filename) => {
      console.log(filename.toString());
    });
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <Drawer
            docked={false}
            open={this.state.drawerOpen}
            onRequestChange={(drawerOpen) => this.setState({ drawerOpen })}
          >
            <MenuItem onClick={this.handleClose}>Export data</MenuItem>
            <MenuItem onClick={this.handleImportFile}>Import data</MenuItem>
          </Drawer>
          <AppBar
            iconElementLeft={
              <IconButton
                onClick={this.handleToggle}
              >
                <NavigationMenu />
              </IconButton>
            }
            iconElementRight={<FlatButton label="Save" />}
            title="Hack"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />

          <div style={{ height: 1000 }}>
            <SortableTree
              treeData={this.props.tasks.treeData}
              onChange={newState => this.props.updateTasksState(newState)}
              nodeContentRenderer={Task}
              generateNodeProps={(callbackParams) => {
                console.log('callbackParams', callbackParams.node.title, callbackParams);
                return {
                  isFirstElement: callbackParams.path.slice(-1)[0] === 0,
                  isLastElement: callbackParams.lowerSiblingCounts.slice(-1)[0] === 0,
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
