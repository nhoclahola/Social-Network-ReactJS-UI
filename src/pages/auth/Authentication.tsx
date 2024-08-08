import { Box, Card, Grid, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import Login from './Login'
import Register from "./Register"
import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"

const Authentication = () => {
  const auth = useSelector((store: RootState) => store.auth)
  const theme = useTheme();
  const isMdOrSmaller = useMediaQuery(theme.breakpoints.down('md'));
  return (
        <Grid className="h-screen" container>
            <Grid className="" item xs={0} md={7}>
                <div className="h-full w-full bg-custom-image bg-cover bg-center"></div>
            </Grid>
            <Grid item xs={12} md={5}>
              <div className={`flex flex-col justify-center px-4 md:px-20 h-full ${isMdOrSmaller ? 'bg-custom-image' : ''}`}>
                <Card className="p-8">
                  <div className="flex flex-col mb-5 space-y-1">
                    <h1 className="text-center font-bold text-xl">Y.COM</h1>
                    <p className="text-center">This is the new social newwork</p>
                  </div>

                  <Routes>
                    <Route path="login" element={auth.user ? <Navigate to="/"/> : <Login/>}/>
                    <Route path="register" element={auth.user ? <Navigate to="/"/> : <Register/>}/>
                    <Route path="*" element={auth.user ? <Navigate to="/" replace/> : <Navigate to="/login" replace/>}/>
                  </Routes>
                  {/* <Outlet></Outlet> */}
                </Card>
              </div>
            </Grid>
        </Grid>
  )
}

export default Authentication