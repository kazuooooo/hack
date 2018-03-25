// absolute
import React, { Component } from 'react';
import { clipboard } from 'electron';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { MuiThemeProvider } from 'material-ui/styles';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MenuItem from 'material-ui/MenuItem';
import SortableTree from 'react-sortable-tree';

// relative
import styles from './Tasks.css';
import Task from '../components/Task';
import MarkDownConverter from '../utils/MarkDownConverter';
import JSONConverter from '../utils/JSONConverter';
import CONSTANTS from '../constants';

const Converters = {
  JSON: JSONConverter,
  MARKDOWN: MarkDownConverter
};

const { dialog } = require('electron').remote;
const fs = require('fs');

Object.freeze(Converters);

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerOpen: false };
    this.handleAddRootTask = this.handleAddRootTask.bind(this);
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

  handleToggle = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }

  handleExport = (converter) => {
    const convertedText = converter.convert(this.props.tasks);
    dialog.showSaveDialog({
      title: CONSTANTS.MESSAGES.SELECT_FOLDER,
      // properties: ["openDirectory"]
    }, (fileName) => {
      if (fileName) {
        try {
          fs.writeFileSync(fileName, convertedText, 'utf-8');
          alert(CONSTANTS.MESSAGES.FILE_EXPORTED);
        } catch (e) {
          alert(CONSTANTS.MESSAGES.FAIL_TO_EXPORT);
        }
      }
    });
  }

  handleCopyToClipBoard = (converter) => {
    const convertedText = converter.convert(this.props.tasks);
    clipboard.writeText(convertedText);
    dialog.showMessageBox({
      message: 'Copy to clipboard :)',
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
            <MenuItem
              primaryText="ExportData"
              rightIcon={<ArrowDropRight />}
              menuItems={[
                <MenuItem primaryText="JSON" onClick={() => this.handleExport(Converters.JSON)} />,
                <MenuItem primaryText="MarkDown" onClick={() => this.handleExport(Converters.MARKDOWN)} />,
              ]}
            />
            <MenuItem
              primaryText="CopyToClipBoard"
              rightIcon={<ArrowDropRight />}
              menuItems={[
                <MenuItem primaryText="JSON" onClick={() => this.handleCopyToClipBoard(Converters.JSON)} />,
                <MenuItem primaryText="MarkDown" onClick={() => this.handleCopyToClipBoard(Converters.MARKDOWN)} />,
              ]}
            />
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
              generateNodeProps={() => ({
                // lastElement: callbackParams.lowerSiblingCounts.slice(-1)[0] === 0,
                actions: {
                  addTask: this.props.addTask,
                  deleteTask: this.props.deleteTask,
                  updateTask: this.props.updateTask
                },
              })}
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
