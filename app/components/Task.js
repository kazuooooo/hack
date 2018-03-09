// @flow
import React, { Component, type Node } from 'react';
// import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentDeleteSweep from 'material-ui/svg-icons/content/delete-sweep';
import TextField from 'material-ui/TextField/TextField';
import Timer from '../components/Timer';
import Checkbox from 'material-ui/Checkbox/Checkbox';
import { getIEVersion } from './vendor/browser-utils';
import baseStyles from './node-renderer-default.scss';
import { isDescendant } from './vendor/tree-data-utils';

type NodeType = {
  children?: Node,
  [key: string]: any,
  title: string,
  active: boolean,
  complete: boolean,
  subtitle?: string
}
type Props = {
  node: NodeType,
  title: null | Function | NodeType,
  subtitle: null | Function | NodeType,
  path: [string | number],
  treeIndex: number,
  treeId: string,
  isSearchMatch: boolean,
  isSearchFocus: boolean,
  canDrag: boolean,
  scaffoldBlockPxWidth: number,
  toggleChildrenVisibility: Function,
  buttons: [?NodeType],
  className: string,
  style: Object,

  actions: Object,

  // Drag and drop API functions
  // Drag source
  connectDragPreview: Function,
  connectDragSource: Function,
  parentNode: ?Object, // Needed for dndManager
  isDragging: boolean,
  didDrop: boolean,
  draggedNode: ?Object,
  // Drop target
  isOver: boolean,
  canDrop: boolean
};
type State = {
  inputText: string
}

let styles = baseStyles;
// Add extra classes in browsers that don't support flex
if (getIEVersion < 10) {
  styles = {
    ...baseStyles,
    row: `${styles.row} ${styles.row_NoFlex}`,
    rowContents: `${styles.rowContents} ${styles.rowContents_NoFlex}`,
    rowLabel: `${styles.rowLabel} ${styles.rowLabel_NoFlex}`,
    rowToolbar: `${styles.rowToolbar} ${styles.rowToolbar_NoFlex}`,
  };
}

class Task extends Component<Props, State> {
  static defaultProps = {
    isSearchMatch: false,
    isSearchFocus: false,
    canDrag: false,
    toggleChildrenVisibility: null,
    buttons: [],
    className: '',
    style: {},
    parentNode: null,
    draggedNode: null,
    canDrop: false,
    title: null,
    subtitle: null,
  }

  constructor(props: Props) {
    super(props);
    // HACK: Use state for input text for performaance
    //       (redux state crazy slow because of render on every character change)
    this.state = { inputText: '' };
    this.saveInputText = this.saveInputText.bind(this);
  }

  saveInputText(ev: Object) {
    if (ev.target.value) {
      this.props.node.title = ev.target.value;
      this.props.actions.updateTask(this.props.node, this.props.path, { active: false });
    } else {
      // delete if text is empty
      this.props.actions.deleteTask(this.props.path);
    }
  }

  render() {
    const {
      scaffoldBlockPxWidth,
      toggleChildrenVisibility,
      connectDragPreview,
      connectDragSource,
      isDragging,
      canDrop,
      canDrag,
      node,
      title,
      subtitle,
      draggedNode,
      path,
      treeIndex,
      isSearchMatch,
      isSearchFocus,
      buttons,
      className,
      style,
      didDrop,
      treeId,
      isOver, // Not needed, but preserved for other renderers
      parentNode, // Needed for dndManager
      // startTask,
      // endTask,
      // updateTask,
      // updateTasksState,
      ...otherProps
    } = this.props;

    const nodeTitle = title || node.title;
    const nodeSubtitle = subtitle || node.subtitle;

    let handle;
    if (canDrag) {
      if (typeof node.children === 'function' && node.expanded) {
        // Show a loading symbol on the handle when the children are expanded
        //  and yet still defined by a function (a callback to fetch the children)
        handle = (
          <div className={styles.loadingHandle}>
            <div className={styles.loadingCircle}>
              <div className={styles.loadingCirclePoint} />
              <div className={styles.loadingCirclePoint} />
              <div className={styles.loadingCirclePoint} />
              <div className={styles.loadingCirclePoint} />
              <div className={styles.loadingCirclePoint} />
              <div className={styles.loadingCirclePoint} />
              <div className={styles.loadingCirclePoint} />
              <div className={styles.loadingCirclePoint} />
              <div className={styles.loadingCirclePoint} />
              <div className={styles.loadingCirclePoint} />
              <div className={styles.loadingCirclePoint} />
              <div className={styles.loadingCirclePoint} />
            </div>
          </div>
        );
      } else {
        // Show the handle used to initiate a drag-and-drop
        handle = connectDragSource(<div className={styles.moveHandle} />, {
          dropEffect: 'copy',
        });
      }
    }

    // task context
    let taskDom;
    if (this.props.node.active) {
      // active text field
      taskDom = (
        // hintText need to avoid warning
        // refer this https://github.com/mui-org/material-ui/issues/4659
        <TextField
          id={this._reactInternalInstance._rootNodeID}
          hintText="type task"
          name={nodeTitle}
          value={this.state.inputText}
          onChange={(event) => {
            this.setState({ inputText: event.target.value });
          }}
          onBlur={(ev) => {
            this.saveInputText(ev);
          }}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              this.saveInputText(ev);
            }
          }
          }
        />
      );
    } else {
      // span
      taskDom = (
        <div className={styles.rowLabel}>
          <span
            className={
                styles.rowTitle +
                (node.complete ? ` ${styles.rowTitleCompleted}` : '')
              }
            onClick={() => {
                this.props.actions.updateTask(this.props.node, this.props.path, { active: true });
              }}
          >
            {typeof nodeTitle === 'function'
                ? nodeTitle({
                  node,
                  path,
                  treeIndex,
                })
                : nodeTitle}
          </span>

          {nodeSubtitle && (
            <span className={styles.rowSubtitle}>
                {typeof nodeSubtitle === 'function'
                  ? nodeSubtitle({
                    node,
                    path,
                    treeIndex,
                  })
                  : nodeSubtitle}
            </span>
          )}
        </div>
      );
    }

    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
    const isLandingPadActive = !didDrop && isDragging;
    return (
      <div style={{ height: '100%' }} {...otherProps}>
        {toggleChildrenVisibility &&
        node.children &&
        (node.children.length > 0 || typeof node.children === 'function') && (
          <div>
            <button
              type="button"
              aria-label={node.expanded ? 'Collapse' : 'Expand'}
              className={
                node.expanded ? styles.collapseButton : styles.expandButton
              }
              style={{ left: -0.5 * scaffoldBlockPxWidth }}
              onClick={() =>
                toggleChildrenVisibility({
                  node,
                  path,
                  treeIndex,
                })
              }
            />

            {node.expanded &&
            !isDragging && (
              <div
                style={{ width: scaffoldBlockPxWidth }}
                className={styles.lineChildren}
              />
            )}
          </div>
        )}
        <div className={styles.rowWrapper}>
          {/* Set the row preview to be used during drag and drop */}
          {connectDragPreview(<div
            className={
                styles.row +
                (isLandingPadActive ? ` ${styles.rowLandingPad}` : '') +
                (isLandingPadActive && !canDrop
                  ? ` ${styles.rowCancelPad}`
                  : '') +
                (isSearchMatch ? ` ${styles.rowSearchMatch}` : '') +
                (isSearchFocus ? ` ${styles.rowSearchFocus}` : '') +
                (className ? ` ${className}` : '')
              }
            style={{
                opacity: isDraggedDescendant ? 0.5 : 1,
                ...style,
              }}
          >
            {handle}

            <div
              className={
                  styles.rowContents +
                  (!canDrag ? ` ${styles.rowContentsDragDisabled}` : '')
                }
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  style={{ display: 'inline-block', width: '30px' }}
                  checked={node.complete}
                  onCheck={(_, checked) => {
                      this.props.actions.updateTask(this.props.node, this.props.path, { complete: checked });
                    }
                    }
                />
                {taskDom}
              </div>
              <div className={styles.rowToolbar}>
                {buttons.map((btn, index) => (
                  <div
                    key={index} // eslint-disable-line react/no-array-index-key
                    className={styles.toolbarButton}
                  >
                    {btn}
                  </div>
                  ))}
              </div>
            </div>
            <MuiThemeProvider>
              <FloatingActionButton
                mini
                onClick={() => {
                    this.props.actions.addTask(
                      this.props,
                      {
                        title: '',
                        active: true,
                        complete: false,
                        expanded: true,
                        children: []
                      }
                    );
                  }
                  }
              >
                <ContentAdd />
              </FloatingActionButton>
            </MuiThemeProvider>
            <MuiThemeProvider>
              <FloatingActionButton
                mini
                backgroundColor="#d10000"
                onClick={() => this.props.actions.deleteTask(this.props.path)}
              >
                <ContentDeleteSweep />
              </FloatingActionButton>
            </MuiThemeProvider>
            <Timer
              onStart={(time) => {
                  this.props.actions.updateTask(this.props.node, this.props.path, {
                    start_time: time,
                    is_time_measuring: true
                  });
                }}
              onStop={(time) => {
                  this.props.actions.updateTask(this.props.node, this.props.path, {
                    end_time: time,
                    is_time_measuring: false
                  });
                }}
              is_time_measuring={this.props.node.is_time_measuring}
            />
          </div>)}

        </div>
      </div>
    );
  }
}

export default Task;
