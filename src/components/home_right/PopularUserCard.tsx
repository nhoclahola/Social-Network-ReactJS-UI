import { Avatar, Button, Card, CardHeader, IconButton } from "@mui/material"
import { red } from "@mui/material/colors"
import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import User from "../../utils/UserInterface";
import { Link } from "react-router-dom";

const PopularUserCard = (user: User) => {
  return (
    <Link to={`/profile/${user.userId}`} className="border border-blue-200 rounded-full px-2 flex gap-x-4 items-center py-2">
      <Avatar>
        {user.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
      </Avatar>
      <div>
        <h1 className="font-bold">{user.firstName + " " + user.lastName}</h1>
        <p className="opacity-70">@{user.username}</p>
      </div>
    </Link>
  )
}

export default PopularUserCard