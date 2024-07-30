import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Authentication from './pages/auth/Authentication';
import { Navigate, Route, Routes } from "react-router-dom";
import Message from "./pages/message/Message";
import HomePage from "./pages/home/HomePage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useAppDispatch } from "./redux/hook";
import { getProfileAction } from "./redux/auth/auth.action";

function App() {
  const { auth } = useSelector((store: RootState) => store)
  const dispatch = useAppDispatch();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    dispatch(getProfileAction(jwt));
  }, [jwt]);
    
  return (
    <div>
      {/* <Routes>
        <Route path="/*" element={auth.user ? <HomePage /> : <Authentication/>} />
        <Route path="/message" element={<Message/>} />
        <Route element={<Authentication/>}>
          replace the current history, so it does not save /profile/:id in history
          <Route index element={<Navigate to="/login" replace/>}/>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes> */}
      <Routes>
        <Route path="/*" element={auth.user ? <HomePage /> : <Authentication/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
