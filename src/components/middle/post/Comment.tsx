import { Avatar } from "@mui/material"
import React from 'react'

export interface CommentProps {
  commentId: string;
  content: string;
  createdAt: string;
  user: User
};

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

const Comment = ({ commentId, content, createdAt, user }: CommentProps) => {
  return (
    <div className="flex flex-row gap-x-4">
      <Avatar className="cursor-pointer" sx={{ width: "2rem", height: "2rem" }} />
      <div>
        <div className="w-full rounded-xl border px-4 py-2 bg-slate-300 space-y-[-4px]">
          <h3 className="font-semibold">{user.email}</h3>
          <p className="whitespace-pre-line">{content}</p>
        </div>
        <div className="flex gap-x-4 items-center justify-between">
          <h5 className="text-sm text-cyan-500 cursor-pointer ml-2">Like</h5>
          <span className="text-xs tracking-tighter">{createdAt}</span>
        </div>
      </div>
    </div>
  )
}

export default Comment