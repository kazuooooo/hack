import React, { Component } from 'react';
import ContentForward from 'material-ui/svg-icons/content/forward';

class Timer extends Component {
  constructor() {
    super();
    this.state = { time: {}, seconds: 0 };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer  = this.stopTimer.bind(this)
    this.countUp = this.countUp.bind(this);
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  startTimer() {
    this.timer = setInterval(this.countUp, 1000);
    this.props.onStart(this.state.time)
  }

  stopTimer() {
    clearInterval(this.timer);
    this.props.onStop(this.state.time)
  }

  countUp() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds + 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
  }

  render() {
    let button = this.props.is_time_measuring ? (<button onClick={this.stopTimer}>Stop</button>) : (<button onClick={this.startTimer}>Start</button>)
    return(
      <div>
        {button}
        {this.state.time.h} h : {this.state.time.m} min: {this.state.time.s} sec
      </div>
    );
  }
}
export default Timer;
