import React, { Component } from 'react';
import Paper from 'material-ui/Paper/Paper';

class Timer extends Component {

  render() {
    // TODO: css 切り出し
    const style = {
      height: 30,
      width: 100,
      textAlign: 'center',
      display: 'inline-block',
    };

    return (
      <div style={{ display: 'inline-block' }}>
        <Paper style={style} zDepth={3}>this is paper</Paper>
        <Paper style={style} zDepth={3}>this is paper</Paper>
      </div>
    );
  }
}
export default Timer;
