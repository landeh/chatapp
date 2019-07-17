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
import Div100vh from 'react-div-100vh'

class App extends React.Component {

  state = {
    messages: [],
    name: '',
    editName: false,
    showCamera: false
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
          this.receive({
            ...change.doc.data(),
            id: change.doc.id
          })
        }

        if (change.type === 'removed') {
          this.remove(change.doc.id)
        }
      })
    })
  }

  remove = (id) => {
    var msgs = [...this.state.messages]
    var messages = msgs.filter(m => m.id !== id)
    this.setState({ messages })
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
      <Div100vh className="App">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'chatter' }}>
            <img src={logo} className="logo" />
            {editName ? ' ' : 'Chatter'}
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
            return <Message key={i} m={m} name={name}
              onClick={() => {
                if (name === m.from) {
                  this.db.collection('messages').doc(m.id).delete()
                }
              }
              }
            />
          })}
        </main>
        <TextInput sendMessage={text => this.send({ text })}
          showCamera={() => this.setState({ showCamera: true })}
        />
        {this.state.showCamera && <Camera takePicture={this.takePicture} />}
      </Div100vh>
    );
  }

  takePicture = async (img) => {
    this.setState({ showCamera: false })
    const imgID = Math.random().toString(36).substring(7);
    var storageRef = firebase.storage().ref();
    var ref = storageRef.child(imgID + '.jpg');
    await ref.putString(img, 'data_url')
    this.send({ img: imgID })
  }
}

export default App;
const bucket = 'https://firebasestorage.googleapis.com/v0/b/chatter-app-ef157.appspot.com/o/'
const suffix = '.jpg?alt=media'

function Message(props) {
  var { m, name, onClick } = props
  return (<div className="bubble-wrap"
    from={m.from === name ? "me" : "you"}
    onClick={onClick}>
    {m.from !== name && <div className="bubble-name">{m.from}</div>}
    <div className="bubble">
      <span> {m.text}</span>
      {m.img && <img alt="pic" src={bucket + m.img + suffix} />}
    </div>
  </div>)
}