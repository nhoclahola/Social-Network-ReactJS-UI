import { Card, Grid } from '@mui/material'
import React from 'react'
import Login from './Login'
import Register from "./Register"

const Authentication = () => {
  return (
        <Grid className="h-screen" container>
            <Grid className="" item xs={7}>
                {/* <img title="abc" className="h-full w-full" src="/../src/img/img.png"></img> */}
                <div className="h-full w-full bg-custom-image bg-cover bg-center"></div>
            </Grid>
            <Grid item xs={5}>
              <div className="flex flex-col justify-center px-20 h-full">
                <Card className="p-8">
                  <div className="flex flex-col mb-5 space-y-1">
                    <h1 className="text-center">Neo Zing</h1>
                    <p className="text-center">This is the new social newwork called Neo Zing to nostalgize Zing Me</p>
                  </div>
                  <Login></Login>
                  {/* <Register></Register> */}
                  
                </Card>
              </div>
            </Grid>
        </Grid>
  )
}

export default Authentication