import React from 'react';
import './App.css';
import logo from './logo.png'
import arrow from './arrow.png'
import TextInput from './TextInput'

class App extends React.Component {

  state ={
    messages:[],
    name:'',
    editName: ''
  }

  gotMessage = (m) => {
    var newMessagesArray =[...this.state.messages, m]
    this.setState({messages: newMessagesArray})
  }

  render() {
    var {messages} = this.state
    return (
      <div className="App">
        <header className="header">
          <img src={logo} className="logo" />
          Chatter
        <namePicker/>  
      </header>
      <main className = "messages">
        {messages.map((m,i) => {
          return <div key= {i} className= "bubble-wrap"> 
            <div className ="bubble"> 
              <span> {m}</span>
            </div>
          </div>
        })}

      </main>
        <TextInput sendMessage={this.gotMessage }/>
      </div>
    );
  }

}

export default App;