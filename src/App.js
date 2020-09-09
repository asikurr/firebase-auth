import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

function App() {

  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
  })
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        const userInfo = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        }
        setUser(userInfo);



        // console.log(res);

      })
      .catch(err => {
        console.log(err)
        console.log(err.code)
        console.log(err.message)
      }

      )

  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res =>{
      const userSignOut = {
        isSignedIn: false
      }
      setUser(userSignOut)
      // console.log(res);
    })
    .catch(err => console.log(err.message))
  }

  const handleChange = (e) => {
    // console.log(e.target.name,  e.target.value)
    let isFormValid = true;
    if (e.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value)
      // console.log(isEmailValid);
    }

    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordContainNumber = /\d{1}/.test(e.target.value)
      isFormValid = isPasswordValid && passwordContainNumber
    }

    if(isFormValid){
      const newUser = {...user};
      newUser[e.target.name] = e.target.value;
      setUser(newUser);

    }
  }

  const handleSubmit = () => {

  }
  return (
    <div className="App">
    {
      user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
      <button onClick={handleSignIn}>Sign In With Google</button>
    }
      

      {
        user.isSignedIn && (
          <div>
            <h4>Name is : {user.name}</h4>
            <p>Email is : {user.email}</p>
            <img src={user.photo} alt="user img"/>
          </div>
        )
      }

      <h1>Our Own Authentication</h1>
      <p>Email is : {user.email}</p>
      <p>Password is : {user.password}</p>
      <form onSubmit={handleSubmit} >
        <input type="text" name="email" onChange={handleChange} placeholder="Email" id="email" required/><br/>
        <input type="password" name="password" onChange={handleChange} placeholder="Password" id="password" required/><br/>
        <input type="submit" value="Sunmit"/>
      </form>

    </div>
  );
}

export default App;
