import React from 'react'
import MessageInterface from "../../utils/MessegaInterface";
import { Avatar } from "@mui/material";

interface MessageProps {
  isSender: boolean;
  message: MessageInterface;
  showAvatar: boolean;
}

const Message = ({ isSender, message, showAvatar }: MessageProps) => {
  return (
    <div className={`flex max-w-[80%] ${isSender ? "self-end" : "self-start"} gap-x-2`}>
      {(!isSender && showAvatar) ?
        <Avatar className="outline outline-2 outline-slate-300" sx={{ width: "2rem", height: "2rem" }}>
          {message?.user?.avatarUrl && <img src={message.user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
        </Avatar> : <div className="w-[2rem]"></div>}
      <div className={` bg-red-300 rounded-xl max-w-[80%] ${isSender && "ml-[20%]"}`}>
        {message.imageUrl && <img className="rounded-t-xl" alt="Message" src="http://127.0.0.1:8080/uploads/posts/user-7c25070c-b33c-43c2-867d-ea5981abb428/images/e4ff7bafe84841b2bb255c282d43af0b.jpg"></img>}
        <p className={` mx-4 py-2`}>{message.content}</p>
      </div>
    </div>
  )
}

export default Message