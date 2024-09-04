import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Authentication from './pages/auth/Authentication';
import { Navigate, Route, Routes } from "react-router-dom";
import Message from "./pages/message/MessagePage";
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
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { dark } from "./theme/dark";
import { light } from "./theme/light";
import MiddlePart from "./components/middle/MiddlePart";

const getThemeByName = (theme: string) => {
  return themeMap[theme];
}

const themeMap: { [key: string]: any } = {
  light,
  dark
};

export const ThemeContext = React.createContext(getThemeByName('darkTheme'));

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

  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "isLoggedOut") {
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    // Cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  const [themeName, setThemeName] = useState(localStorage.getItem("theme") || "dark");
  const theme = getThemeByName(themeName);

  // Check if the theme is saved in local storage or not, if not, save it with default value "dark"
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      localStorage.setItem("theme", "dark");
    }
  }, []);

  return (
    <ThemeContext.Provider value={setThemeName}>
      <ThemeProvider theme={theme}>
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
        <CssBaseline />
        <GlobalStyles
          styles={(theme) => ({
            '*': {
              scrollbarWidth: 'medium',
              scrollbarColor:
                theme.palette.mode === 'light'
                  ? '#cccccc #ffffff' // Light mode: thumb light, track white
                  : '#6b6b6b #121212', // Dark mode: thumb gray, track black
            },
            '*::-webkit-scrollbar': {
              width: '8px',
            },
            '*::-webkit-scrollbar-thumb': {
              backgroundColor:
                theme.palette.mode === 'light' ? '#cccccc' : '#6b6b6b', // Thumb light/dark based on mode
              borderRadius: '10px',
            },
            '*::-webkit-scrollbar-track': {
              backgroundColor:
                theme.palette.mode === 'light' ? '#ffffff' : '#121212', // Track light/dark based on mode
            },
          })}
        />
        <Routes>
          <Route path="/*" element={loading ? <Loading /> : auth.user && jwt ? <MiddlePart auth={auth} /> : <Authentication />}></Route>
        </Routes>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
