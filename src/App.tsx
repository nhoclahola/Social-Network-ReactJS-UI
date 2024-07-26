import React from 'react';
import logo from './logo.svg';
import './App.css';
import Authentication from './pages/auth/Authentication';
import { Navigate, Route, Routes } from "react-router-dom";
import Message from "./pages/message/Message";
import HomePage from "./pages/home/HomePage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<HomePage/>}/>
        <Route path="/message" element={<Message/>}/>
        <Route path="/*" element={<Authentication/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
