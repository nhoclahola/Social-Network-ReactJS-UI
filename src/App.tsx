import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Authentication from './pages/auth/Authentication';
import { Navigate, Route, Routes } from "react-router-dom";
import Message from "./pages/message/MessagePage";
import HomePage from "./pages/home/HomePage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useAppDispatch } from "./redux/hook";
import { getProfileAction } from "./redux/auth/auth.action";
import Loading from "./pages/loading/Loading";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "./config/api";
import { setStompClientThunk } from "./redux/web_socket/webSocket.action";

function App() {
  const auth = useSelector((store: RootState) => store.auth)
  const dispatch = useAppDispatch();
  const jwt = localStorage.getItem("jwt");
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   dispatch(getProfileAction(jwt));
  //   setLoading(false);
  // }, [jwt]);
  useEffect(() => {
    const fetchProfile = async () => {
      if (jwt) {
        try {
          await dispatch(getProfileAction(jwt));
        } catch (error) {
          console.log("error", error);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [jwt]);


  // Connect to web socket
  useEffect(() => {
    if (auth.user) {
      dispatch(setStompClientThunk())
    }
  }, [auth.user]);

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
        <Route path="/*" element={loading ? <Loading /> : auth.user && jwt ? <HomePage auth={auth} /> : <Authentication />}></Route>
      </Routes>
    </div>
  );
}

export default App;
