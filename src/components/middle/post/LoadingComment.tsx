import { CircularProgress } from "@mui/material"
import React from 'react'

const LoadingComment = () => {
  return (
    <div className="flex justify-center items-center">
      <CircularProgress color="inherit" />
    </div>
  )
}

export default LoadingComment