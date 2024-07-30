import { Avatar, Button, Card, CardHeader, IconButton } from "@mui/material"
import { red } from "@mui/material/colors"
import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';

const PopularUserCard = () => {
  return (
    <div className="border border-blue-200 rounded-full px-2">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <Button size="small">
            Follow
          </Button>
        }
        title="Username"
        subheader="@username"
      />
    </div>
  )
}

export default PopularUserCard