import { Avatar, Divider, Grid } from "@mui/material"
import React from 'react'
import MailIcon from '@mui/icons-material/Mail';
import UserChat from "./UserChat";
import Chat from "./Chat";
import SearchUserChatModal from "./SearchUserChatModal";
import ChatInterface from "../../utils/ChatInterface";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import LoadingPost from "../../components/middle/loading_post/LoadingPost";

const Message = () => {
  const [chats, setChats] = React.useState<ChatInterface[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    // setLoading(true);
    axios.get(`/api/chats/user-chat`, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then((response) => {
      setChats(response.data.result);
      // setLoading(false);
    }).catch((error) => {
      setError(true);
      // setLoading(false);
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

  const socketRef = React.useRef<WebSocket | null>(null);
  const [stompClient, setStompClient] = React.useState<Stomp.Client | null>(null);
  React.useEffect(() => {
    setLoading(true);
    const sock = new SockJS(API_BASE_URL + "/ws");
    const client = Stomp.over(sock);
    setStompClient(client);
    socketRef.current = sock;
    client.connect({}, () => {
      console.log('Connected');
      setLoading(false);
      // Add other subscriptions if needed
    }, (error) => {
      console.error('Error:', error);
      setLoading(false);
    });
    // Cleanup function to disconnect STOMP client when component unmounts
    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log('STOMP client disconnected');
        });
      }
      // Close the SockJS connection
      if (socketRef.current) {
        socketRef.current.close();
        console.log('SockJS connection closed');
      }
    };
  }, []);

  return (
    <Grid container>
      <Grid item xs={4}>
        <div className="h-[10vh] font-bold text-xl flex justify-between items-center px-2 bg-slate-200" >
          <h1>Messages</h1>
          <MailIcon onClick={openSearchChat} className="cursor-pointer"></MailIcon>
        </div>
        <div className="flex flex-col gap-y-4 h-[90vh] overflow-y-scroll">
          {/* {users.map((user, index) => <UserMessage key={index}></UserMessage> )} */}
          {loading ? <LoadingPost /> : chats.map((chat, index) => <UserChat key={chat.chatId} chat={chat} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />)}
        </div>
      </Grid>
      <Grid item xs={8}>
        <div className="w-full">
          <Chat stompClient={stompClient} chat={selectedChat} />
        </div>
      </Grid>
      {openSearch && <SearchUserChatModal open={openSearch} handleClose={closeSearchChat} />}
    </Grid>
  )
}

export default Message