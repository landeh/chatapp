import React from 'react';
import './App.css';
import logo from './logo.png'
import arrow from './arrow.png'
import TextInput from './TextInput'

class App extends React.Component {

  state ={
    messages:[]
  }

  sendMessage = (m) => {
    var messages =[...this.state.messages, m]
    this.setState({messages})
  }
  render() {
    return (
      <div className="App">
        <header className="header">
          <img src={logo} className="logo" />
          Chatter
      </header>
        <TextInput sendMessage={this.sendMessage }/>
      </div>
    );
  }

}

export default App;