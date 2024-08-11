import React from 'react'
import MessageInterface from "../../utils/MessegaInterface";

interface MessageProps {
  isSender: boolean;
  message: MessageInterface;
}

const Message = ({isSender, message}: MessageProps) => {
  return (
    <div className={`max-w-[80%] bg-red-300 rounded-xl ${isSender ? "self-end" : "self-start"}`}>
      { message.imageUrl && <img className="rounded-t-xl" alt="Message" src="http://127.0.0.1:8080/uploads/posts/user-7c25070c-b33c-43c2-867d-ea5981abb428/images/e4ff7bafe84841b2bb255c282d43af0b.jpg"></img> }
      <p className={` mx-4 py-2`}>{message.content}</p>
    </div>
  )
}

export default Message