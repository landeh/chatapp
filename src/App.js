import React from 'react';
import './App.css';
import logo from './logo.png'
import arrow from './arrow.png'
import TextInput from './TextInput'

function App() {
  return (
    <div className="App">
      <header className = "header"> 
        <img src= {logo} className = "logo" />  
        Chatter 
      </header>
      <TextInput>
      <button>
        <img src= {arrow} className = "arrow" />
      </button>
      </TextInput>
    </div>
  );
}

export default App;
