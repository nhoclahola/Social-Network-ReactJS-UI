import axios from "axios";
import React, { useCallback } from 'react'
import { API_BASE_URL } from "../../config/api";
import User from "../../utils/UserInterface";
import lodash from "lodash";
import truncateUsername from "../../utils/TruncateName";
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Divider, IconButton, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import ChatInterface from "../../utils/ChatInterface";

interface SearchUserChatProps {
  setChats: React.Dispatch<React.SetStateAction<ChatInterface[]>>;
};

const SearchUserChat = ({ setChats }: SearchUserChatProps) => {
  const theme = useTheme();
  const [users, setUsers] = React.useState<User[]>([]);
  const [openSearch, setOpenSearch] = React.useState<boolean>(false);

  const searchUser = (query: string) => {
    if (query.length > 0)
      axios.get(`/api/users/search`, {
        params: {
          query: query,
          index: 0
        },
        baseURL: API_BASE_URL,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
        }
      }).then((response) => {
        setUsers(response.data.result);
        setOpenSearch(true);
      }).catch((error) => {
        console.error("error", error);
      });
  }

  const debouncedSearchUser = useCallback(
    lodash.debounce((query: string) => {
      if (query.length > 0) {
        searchUser(query);
      }
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0)
      debouncedSearchUser(e.target.value);
    else
      setOpenSearch(false);
  };

  const searchSectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchSectionRef.current && !searchSectionRef.current.contains(event.target as Node)) {
        setOpenSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const createChat = (userId: string) => {
    axios.post(`/api/chats/users/${userId}`, {
    }, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then((response) => {
      const newChat: ChatInterface = response.data.result;
      setChats((prevChats) => {
        const chatExists = prevChats.some(chat => chat.chatId === newChat.chatId);
        if (!chatExists) {
          return [newChat, ...prevChats];
        }
        return prevChats;
      });
    }).catch((error) => {
      console.error("error", error);
    });
  }

  return (
    <div className="relative z-[1] w-[60%]">
      <input
        style={{
          borderColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
        }}
        onFocus={handleInputChange} onChange={handleInputChange} className="w-full p-2 rounded-lg border-[2px]" type="text" placeholder="Search" >
      </input>
      {openSearch && <section ref={searchSectionRef} style={{ backgroundColor: theme.palette.background.paper }} className="border absolute w-full whitespace-nowrap shadow-xl rounded-xl">
        <div className="mt-1"></div>
        {users.map(user => (
          <div className="flex justify-between items-center px-2">
            <Link to={`/profile/${user?.userId}`} key={user?.userId} className="w-full" >
              <div className="hover:bg-slate-200 flex items-center gap-4 p-2">
                <SearchIcon />
                <Avatar className="outline outline-2 outline-slate-300" sx={{ width: "2.3rem", height: "2.3rem" }}>
                  {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
                </Avatar>
                <div className="flex flex-col">
                  <h1 className="font-bold">{truncateUsername(user?.firstName + " " + user?.lastName, 12)}</h1>
                  <h1>@{truncateUsername(user?.username, 10)}</h1>
                </div>
              </div>
              <Divider />
            </Link>
            <IconButton onClick={() => createChat(user.userId)} >
              <MapsUgcIcon />
            </IconButton>
          </div>
        ))}
      </section>}
    </div>
  )
}

export default SearchUserChat