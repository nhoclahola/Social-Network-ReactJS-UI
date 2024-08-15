import React from 'react'
import { Link } from "react-router-dom"
import User from "../../utils/UserInterface";
import { Avatar, Card } from "@mui/material";
import truncateUsername from "../../utils/TruncateName";

interface UserCardProps {
  user: User;
}

const UserCard = ({user}: UserCardProps) => {
  return (
    <Card className="flex justify-between items-center px-2">
      <Link to={`/profile/${user?.userId}`} key={user?.userId} className="w-full" >
        <div className="flex items-center gap-4 p-2">
          {/* <SearchIcon /> */}
          <Avatar className="outline outline-2 outline-slate-300" sx={{ width: "4rem", height: "4rem" }}>
            {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
          </Avatar>
          <div className="flex flex-col">
            <h1 className="font-bold">{truncateUsername(user?.firstName + " " + user?.lastName, 12)}</h1>
            <h1>@{truncateUsername(user?.username, 22)}</h1>
          </div>
        </div>
      </Link>
    </Card>
  )
}

export default UserCard