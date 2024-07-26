import { Grid } from "@mui/material"
import React from 'react'
import Sidebar from "../../components/Sidebar/Sidebar"
import { Route, Routes, useLocation } from "react-router-dom"
import MiddlePart from "../../components/MiddlePart/MiddlePart"
import Reels from "../../components/Reels/Reels"
import CreateReels from "../../components/Reels/CreateReels"
import Profile from "../../components/Profile"
import HomeRight from "../../components/HomeRight/HomeRight"

const HomePage = () => {
  const location = useLocation();
  return (
    <div className="mx-10">
        <Grid container spacing={0}>
          <Grid item xs={0} lg={3}>
            <div className="sticky top-0">
              <Sidebar></Sidebar>
            </div>
          </Grid>

          <Grid item className="px-5 flex justify-center" xs={12} lg={location.pathname === "/" ? 6 : 9}>
            <Routes>
              <Route path="/" element={<MiddlePart/>}/>
              <Route path="/reels" element={<Reels/>}/>
              <Route path="/create-reels" element={<CreateReels/>}/>
              <Route path="/profile/:id" element={<Profile/>}/>
            </Routes>
          </Grid>

          <Grid item lg={3} className="relative">
            <div className="sticky top-0 w-full">
              <HomeRight></HomeRight>
            </div>
          </Grid>
        </Grid>
    </div>
  )
}

export default HomePage