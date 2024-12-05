import React, { useState } from "react";
import "./App.css";
import Login from "./components/auth/login";
import Profile from "./components/profile";
import Register from "./components/auth/register";
import HomeComponent from "./components/home";

import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="home" element={<HomeComponent />} />
      </Routes>
    </div>
  );
}

export default App;
