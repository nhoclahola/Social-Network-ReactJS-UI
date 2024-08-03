import { Backdrop, CircularProgress } from "@mui/material"
import React from 'react'

const LoadingPost = () => {
  return (
    <div className="flex justify-center items-center">
      <CircularProgress color="inherit" />
    </div>
  )
}

export default LoadingPost