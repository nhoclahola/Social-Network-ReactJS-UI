import { Avatar, Divider } from "@mui/material"
import React from 'react'
import ChatInterface from "../../utils/ChatInterface";
import { useAppSelector } from "../../redux/hook";
import truncateUsername from "../../utils/TruncateName";

// For user chat list

interface UserChatProps {
  chat: ChatInterface;
  selectedChat: ChatInterface | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<ChatInterface | null>>;
};

const UserChat = ({chat, selectedChat, setSelectedChat}: UserChatProps) => {
  const handleSetSelectedChat = () => {
    setSelectedChat(chat);
  };

  const auth = useAppSelector((store) => store.auth);
  const user = chat.users.find((user) => user.userId !== auth.user.userId); //
  return (
    <div onClick={handleSetSelectedChat} className={`space-y-2 p-4 rounded-lg ${selectedChat?.chatId !== chat.chatId && "hover:bg-slate-300"} cursor-pointer shadow-sm ${selectedChat?.chatId === chat.chatId && "bg-slate-400"}`}>
      <div className="flex items-center gap-4">
        <Avatar sx={{ width: "3rem", height: "3rem" }}>
          {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
        </Avatar>
        <div>
          <h1 className="font-bold text-lg">{truncateUsername(user?.firstName + " " + user?.lastName, 20)}</h1>
          <p>@{truncateUsername(user?.username + " ", 20)}</p>
        </div>
      </div>
    </div>
  )
}

export default UserChat