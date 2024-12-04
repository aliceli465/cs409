

import React, { useState } from 'react';
import './App.css';
import Login from './components/auth/login';
import Profile from './components/profile';
import Register from './components/auth/register';
import { Route, Routes } from "react-router-dom";
function App() {
  
  

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="login" element={<Login/>} />
        <Route path="register" element={<Register/>}/>
      </Routes>
    </div>
  );
}

export default App;
