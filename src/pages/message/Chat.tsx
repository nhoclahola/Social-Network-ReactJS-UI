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
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import truncateUsername from "../../utils/TruncateName";
import LoadingPost from "../../components/middle/loading_post/LoadingPost";

interface ChatProps {
  chat: ChatInterface | null;
  stompClient: Stomp.Client | null;
}

const Chat = ({ chat, stompClient }: ChatProps) => {
  const auth = useAppSelector((store) => store.auth);

  const [messages, setMessages] = React.useState<MessageInterface[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [index, setIndex] = React.useState(0);
  const [endOfMessages, setEndOfMessages] = React.useState(false);
  const [isNewMessageFromSocket, setIsNewMessageFromSocket] = React.useState(false); // New state

  // First load chat messages
  React.useEffect(() => {
    if (chat) {
      setIndex(0);
      setEndOfMessages(false);
      setLoading(true);
      axios.get(`/api/messages/chats/${chat?.chatId}`, {
        params: {
          index: 0
        },
        baseURL: API_BASE_URL,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
        }
      }).then((response) => {
        if (response.data.result.length < 10)
          setEndOfMessages(true);
        setMessages(response.data.result);
        setLoading(false);
      }).catch((error) => {
        setError(error);
        console.error("error", error);
        setLoading(false);
      })
    }
  }, [chat]);

  React.useEffect(() => {
    if (chat && index > 0) {
      // setLoading(true);
      axios.get(`/api/messages/chats/${chat?.chatId}`, {
        params: {
          index: index
        },
        baseURL: API_BASE_URL,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
        }
      }).then((response) => {
        if (response.data.result.length < 10) {
          setEndOfMessages(true);
        }
        setMessages((prevMessages) => [...response.data.result, ...prevMessages]);
        // setLoading(false);
      }).catch((error) => {
        setError(error);
        console.error("error", error);
        // setLoading(false);
      })
    }
  }, [index])

  const [loadingAddMessage, setLoadingAddMessage] = React.useState(false);
  const [errorAddMessage, setErrorAddMessage] = React.useState(null);

  // To scroll when there is new message
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (messagesEndRef.current && isNewMessageFromSocket) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsNewMessageFromSocket(false); // Reset the state after scrolling
    }
  }, [messages]);

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.shiftKey && event.key === 'Enter') {
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      // addMessage(event.currentTarget.value);
      sendMessageToServer(event.currentTarget.value);
      event.currentTarget.value = "";
    }
  };

  const handleSend = () => {
    if (inputRef.current) {
      // addMessage(inputRef.current.value);
      sendMessageToServer(inputRef.current.value);
      inputRef.current.value = "";
    }
  }

  const messageQueueRef = React.useRef<string[]>([]);
  const isSendingRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    let subscription: Stomp.Subscription | null = null;
    if (chat && stompClient && stompClient.connected) {
      subscription = stompClient?.subscribe(`/user/${chat?.chatId}/private`, (message) => {
        const newMessage: MessageInterface = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setIsNewMessageFromSocket(true); // Mark that this is a new message from socket
      }, {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      });
    }
    // Cleanup function to disconnect STOMP client when component unmounts
    return () => {
      if (subscription) {
        subscription?.unsubscribe();
      }
    };
  }, [chat]);

  // Process the message queue
  const processQueue = React.useCallback(() => {
    if (isSendingRef.current || messageQueueRef.current.length === 0) {
      return;
    }
    const message = messageQueueRef.current.shift(); // Get the first message in the queue
    if (message && stompClient && chat) {
      isSendingRef.current = true; // Mark as sending
      stompClient.send(`/app/chat/${chat.chatId}`, {}, JSON.stringify({ content: message }));

      // Wait for 100ms before sending the next message
      setTimeout(() => {
        isSendingRef.current = false;
        processQueue();
      }, 300);
    }
  }, [stompClient, chat]);

  const sendMessageToServer = (message: string) => {
    if (message) {
      messageQueueRef.current.push(message);
      processQueue();
    }
  };

  // Load new message when user scroll to top
  // Closure to keep track of the endOfMessages state
  const endOfMessagesRef = React.useRef(endOfMessages);
  React.useEffect(() => {
    endOfMessagesRef.current = endOfMessages;
  }, [endOfMessages]);

  const divRef = React.useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    const div = divRef.current;
    if (div && div.scrollTop === 0) {
      if (!endOfMessagesRef.current) {
        console.log('Scrolled to the top!');
        divRef.current.scrollBy(0, 100);
        setIndex((prev) => prev + 10);
      } else {
        console.log('End of messages');
      }
    }
  };

  React.useEffect(() => {
    const div = divRef.current;
    if (div) {
      div.addEventListener('scroll', handleScroll);
      return () => {
        div.removeEventListener('scroll', handleScroll);
      };
    }
  }, [chat]);

  React.useEffect(() => {
    console.log(endOfMessages)
  }, [endOfMessages]);

  const user = chat?.users.find((user) => user.userId !== auth.user.userId); //

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
          <Avatar sx={{ width: "3rem", height: "3rem" }}>
            {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
          </Avatar>
          <h1 onClick={() => setIndex((prev) => prev + 10)} className="font-bold text-xl">{truncateUsername(user?.firstName + " " + user?.lastName, 20)}</h1>
        </div>
        <LocalPhoneIcon />
      </div>
      <div ref={divRef} className="p-4 flex flex-col gap-y-4 h-[80vh] overflow-y-scroll">
        {endOfMessages && <p className="text-gray-500 text-sm italic text-center">There are no ealier messages</p>}
        {loading && <LoadingPost />}
        {messages.map((message, index) => {
          const isSender = message?.user?.userId === auth.user?.userId;
          const showAvatar = !isSender && (index === 0 || messages[index - 1].user.userId !== message.user.userId);
          return (
            <Message key={message.messageId} message={message} isSender={isSender} showAvatar={showAvatar} ></Message>
          )
        })}
        <div ref={messagesEndRef} />
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