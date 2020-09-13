import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

function App() {

  const provider = new firebase.auth.GoogleAuthProvider();
  const [isNewUser, setIsNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false
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
      .then(res => {
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
    if (e.target.name === 'name') {
      isFormValid = e.target.value.length > 4
      //  console.log(isFormValid);
    }

    if (e.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value)
      // console.log(isEmailValid);
    }

    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordContainNumber = /\d{1}/.test(e.target.value)
      isFormValid = isPasswordValid && passwordContainNumber
      console.log(isPasswordValid, passwordContainNumber)
    }

    if (isFormValid) {
      const newUser = { ...user };
      newUser[e.target.name] = e.target.value;
      setUser(newUser);

    }
  }

  const handleSubmit = (e) => {
    // console.log(user.email, user.password)
    ;
    // console.log(user.email , user.password)
    if (isNewUser && user.email && user.password) {
      // debugger
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUser = { ...user };
          newUser.error = '';
          newUser.success = true;
          setUser(newUser)
          updateUser(user.name)

        })

        .catch(error => {
          const newUser = { ...user };
          newUser.error = error.message
          newUser.success = false;
          setUser(newUser);

          // var errorMessage = error.message;
          // console.log(error.message)
        });

    }

    if (!isNewUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUser = { ...user };
          newUser.error = '';
          newUser.success = true;
          setUser(newUser)
          console.log(res.user)

        })
        .catch(error => {
          const newUser = { ...user };
          newUser.error = error.message
          setUser(newUser);
        });
    }

    e.preventDefault();

  }

  const updateUser = name => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name

    }).then(res => {
      console.log('Updated profile successful')
    }).catch(error => {
      console.log('Updated profile faild', error)
    });
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
            <img src={user.photo} alt="user img" />
          </div>
        )
      }

      <h1>Our Own Authentication</h1>
      {/* <p>Name is : {user.name}</p>
      <p>Email is : {user.email}</p>
      <p>Password is : {user.password}</p> */}
      <p style={{ color: 'red' }}>{user.error}</p>
      {
        user.success && <p style={{ color: 'green' }}>Account {isNewUser ? 'Create' : 'Login'} Successfully</p>

      }
      <input type="checkbox" onClick={() => setIsNewUser(!isNewUser)} name="isNewUser" id="" />
      <label htmlFor="isNewUser">New User SignUp</label>
      <form onSubmit={handleSubmit} >
        {
          isNewUser && <input type="text" name="name" onBlur={handleChange} placeholder="Name" id="name" required />
        }
        <br />
        <input type="text" name="email" onBlur={handleChange} placeholder="Email" id="email" required /><br />
        <input type="password" name="password" onBlur={handleChange} placeholder="Password" id="password" required /><br />

        {
          isNewUser ? <input type="submit" value="Sign Up" /> : <input type="submit" value="Log In" />
        }



      </form>

    </div>
  );
}

export default App;
