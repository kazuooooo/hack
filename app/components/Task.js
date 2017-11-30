// @flow
import React, { Component } from 'react';
import {ListItem} from 'material-ui/List';

class Task extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
       <ListItem>
          <p>{this.props.text}</p>
        </ListItem>
      </div>
    );
  }
}
export default Task;
