// Check for Decorator is Working lol
import React, { Component } from 'react';

export default function Octcatable(TaskComponent) {
  return class extends Component {
    render() {
      return (
        <div>
          <TaskComponent {...this.props} />
          <img src="https://octodex.github.com/images/poptocat_v2.png" height="100" width="100" alt="octcat" />
        </div>
      );
    }
  };
}
