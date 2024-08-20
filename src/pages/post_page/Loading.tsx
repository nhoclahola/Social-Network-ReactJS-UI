import { CircularProgress } from "@mui/material"
import React from 'react'

const Loading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <CircularProgress color="inherit" />
    </div>
  )
}

export default Loading