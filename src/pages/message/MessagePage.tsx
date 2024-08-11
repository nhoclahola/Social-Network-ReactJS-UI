import { Avatar, Divider, Grid } from "@mui/material"
import React from 'react'
import MailIcon from '@mui/icons-material/Mail';
import UserChat from "./UserChat";
import Chat from "./Chat";
import SearchUserChatModal from "./SearchUserChatModal";
import ChatInterface from "../../utils/ChatInterface";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const Message = () => {
  const [chats, setChats] = React.useState<ChatInterface[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`/api/chats/user-chat`, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then((response) => {
      setChats(response.data.result);
      setLoading(false);
    }).catch((error) => {
      setError(true);
      setLoading(false);
    });
  }, []);


  const [openSearch, setOpenSearch] = React.useState(false);

  const openSearchChat = () => {
    setOpenSearch(true);
  }

  const closeSearchChat = () => {
    setOpenSearch(false);
  }

  const [selectedChat, setSelectedChat] = React.useState<ChatInterface | null>(null);

  return (
    <Grid container>
      <Grid item xs={4}>
        <div className="h-[10vh] font-bold text-xl flex justify-between items-center px-2 bg-slate-200" >
          <h1>Messages</h1>
          <MailIcon onClick={openSearchChat} className="cursor-pointer"></MailIcon>
        </div>
        <div className="flex flex-col gap-y-4 h-[90vh] overflow-y-scroll">
          {/* {users.map((user, index) => <UserMessage key={index}></UserMessage> )} */}
          {chats.map((chat, index) => <UserChat key={chat.chatId} chat={chat} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />)}
        </div>
      </Grid>
      <Grid item xs={8}>
        <div className="w-full">
          <Chat chat={selectedChat} />
        </div>
      </Grid>
      {openSearch && <SearchUserChatModal open={openSearch} handleClose={closeSearchChat} />}
    </Grid>
  )
}

export default Message