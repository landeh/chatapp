import React from 'react';
import './App.css';
import logo from './logo.png'
import arrow from './arrow.png'
import TextInput from './TextInput'
import NamePicker from './NamePicker'
import Camera from 'react-snap-pic'
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage"
class App extends React.Component {

  state = {
    messages:[],
    name:'',
    editName:false,
    showCamera:false
  } 
  }
  receive = (m) => {
    const messages = [m, ...this.state.messages]
    messages.sort((a, b) => b.ts - a.ts)
    this.setState({ messages })
  }

  send = (m) => {
    this.db.collection("messages").add({
      ...m,
      from: this.state.name || 'No name',
      ts: Date.now()
    })
  }

  componentWillMount() {
    var name = localStorage.getItem('name')
    if (name) {
      this.setState({ name })
    }

    firebase.initializeApp({
      apiKey: "AIzaSyBadYFvEVY3FBLZFqtDTILV_35m8lFLVto",
      authDomain: "chatter-app-ef157.firebaseapp.com",
      databaseURL: "https://chatter-app-ef157.firebaseio.com",
      projectId: "chatter-app-ef157",
      storageBucket: "chatter-app-ef157.appspot.com"
    });

    this.db = firebase.firestore();

    this.db.collection("messages").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          //console.log(change.doc.data())
          this.receive(change.doc.data())
        }
      })
    })
  }

  setEditName = (editName) => {
    if (!editName) {
      localStorage.setItem('name', this.state.name)
    }
    this.setState({ editName })
  }


  render() {
    var { editName, messages, name } = this.state
    return (
      <div className="App">
        <header className="header">
          <div>
            <img src={logo} className="logo" />
            Chatter
        </div>
          <NamePicker
            name={name}
            editName={editName}
            changeName={name => this.setState({ name })}
            setEditName={this.setEditName}
          />
        </header>
        <main className="messages">
          {messages.map((m, i) => {
            return <Message key={i} m={m} name={name} />
          })}
        </main>
        <TextInput sendMessage={text => this.send({ text })} 
          showCamera={()=>this.setState({showCamera:true})}
        />
        />
      </div>
    );
  }

  takePicture = (img) => {
    console.log(img)
    this.setState({showCamera:false})
}
export default App;

function Message(props) {
  var { m, name} = props
  return (<div key={i} className="bubble-wrap"
    from={m.from === name ? "me" : "you"}>
    {m.from !== name && <div className="bubble-name">{m.from}</div>}
    <div className="bubble">
      <span> {m.text}</span>
    </div>
  </div>)
}