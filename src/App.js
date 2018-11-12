import React, { PureComponent } from 'react';
import './App.css';

class App extends PureComponent {
  state = {
    time: new Date(),
  };

  timeInterval: IntervalID;

  componentDidMount() {
    this.timeInterval = setInterval(() =>
    this.setState({time: new Date(), }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

    render() {
      const { time } = this.state;
      let session = 'AM';
      let hours = time.getHours(),
          minutes = time.getMinutes(),
          seconds = time.getSeconds();

      if ( hours === 0) {
          hours = 12;
      }

      if ( hours > 12) {
          hours = hours - 12;
          session = 'PM';
      }

       seconds = seconds < 10 ? '0' + seconds : seconds;
       hours = hours < 10 ? '0' + hours : hours;
       minutes = minutes < 10 ? '0' + minutes : minutes;

      return (

        <div className="timer">{hours}:{minutes}:{seconds} <span className="session">{session}</span></div>
      )
  }
}

export default App;
