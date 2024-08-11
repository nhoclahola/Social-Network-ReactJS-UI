import { Avatar } from "@mui/material"
import React from 'react'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Message from "./Message";
import SearchUserChatModal from "./SearchUserChatModal";
import MessageInterface from "../../utils/MessegaInterface";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import ChatInterface from "../../utils/ChatInterface";
import { useAppSelector } from "../../redux/hook";
import SendIcon from '@mui/icons-material/Send';

interface ChatProps {
  chat: ChatInterface | null;
}

const Chat = ({ chat }: ChatProps) => {
  const auth = useAppSelector((store) => store.auth);

  const [messages, setMessages] = React.useState<MessageInterface[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`/api/messages/chats/${chat?.chatId}`, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then((response) => {
      setMessages(response.data.result);
      setLoading(false);
    }).catch((error) => {
      setError(true);
      setLoading(false);
    })
  }, [chat]);

  const [loadingAddMessage, setLoadingAddMessage] = React.useState(false);
  const [errorAddMessage, setErrorAddMessage] = React.useState(null);

  const addMessage = (message: string) => {
    setLoadingAddMessage(true);
    axios.post(`/api/messages/chats/${chat?.chatId}`, {
      content: message
    },
      {
        baseURL: API_BASE_URL,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
        }
      }).then((response) => {
        setMessages([...messages, response.data.result]);
        setLoadingAddMessage(false);
      }).catch((error) => {
        setErrorAddMessage(error);
        setLoadingAddMessage(false);
      })
  }

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.shiftKey && event.key === 'Enter') {
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      addMessage(event.currentTarget.value);
      event.currentTarget.value = "";
    }
  };

  const handleSend = () => {
    if (inputRef.current) {
      addMessage(inputRef.current.value);
      inputRef.current.value = "";
    }
  }

  if (chat === null)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="font-bold text-2xl">Select a chat to start messaging</h1>
      </div>
    )

  return (
    <div className="h-screen overflow-hidden">
      <div className="h-[10vh] flex justify-between items-center p-4 bg-slate-300">
        <div className="flex items-center gap-x-2">
          <Avatar />
          <h1 className="font-bold text-xl">nhoclahola</h1>
        </div>
        <LocalPhoneIcon />
      </div>
      <div className="p-4 flex flex-col gap-y-4 h-[80vh] overflow-y-scroll">
        {messages.map((message, index) => <Message key={message.messageId} message={message} isSender={message?.user?.userId === auth.user?.userId}></Message>)}
      </div>
      {/* <div className="h-[10vh] ">
        <input className="w-full p-4" placeholder="Type a message"></input>
      </div> */}
      <div className="relative w-full">
        <textarea ref={inputRef} onKeyDown={handleKeyDown} rows={1} placeholder="Type a message" title="message"
          className="w-full resize-none outline-none bg-transparent border border-[#3b4054] rounded-lg px-5 py-2" />
        <SendIcon
          onClick={handleSend}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-cyan-500"
        />
      </div>
    </div>
  )
}

export default Chat