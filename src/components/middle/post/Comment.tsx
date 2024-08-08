import { Avatar } from "@mui/material"
import React from 'react'
import formatDateFromString from "../../../utils/ConvertDate";
import User from "../../../utils/UserInterface";
import { Link } from "react-router-dom";

export interface CommentProps {
  commentId: string;
  content: string;
  createdAt: string;
  user: User
};

const Comment = ({ commentId, content, createdAt, user }: CommentProps) => {
  return (
    <div className="flex flex-row gap-x-4">
      <Link to={`/profile/${user.userId}`}>
        <Avatar className="cursor-pointer" sx={{ width: "2rem", height: "2rem" }} >
          {user.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
        </Avatar>
      </Link>
      <div>
        <div className="w-full rounded-xl border px-4 py-2 bg-slate-300">
          <Link to={`/profile/${user.userId}`}>
            <h3 className="font-semibold text-sm">{user.firstName} {user.lastName}</h3>
          </Link>
          <p className="whitespace-pre-line">{content}</p>
        </div>
        <div className="flex gap-x-4 items-center">
          <h5 className="text-sm text-cyan-500 cursor-pointer ml-2">Like</h5>
          <span className="text-xs tracking-tighter">{formatDateFromString(createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

export default Comment