import axios from "axios";
import React, { useCallback } from 'react'
import { API_BASE_URL } from "../../config/api";
import User from "../../utils/UserInterface";
import lodash from "lodash";
import truncateUsername from "../../utils/TruncateName";
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Divider, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const SearchUser = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const inputRef = React.useRef<HTMLInputElement>(null);
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

  return (
    <div className="relative z-[1]">
      <input 
      style={{
        borderColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
      }}
      ref={inputRef} onFocus={handleInputChange} onChange={handleInputChange} className="w-full p-2 rounded-lg border-[2px] focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2" type="text" placeholder="Search" >
      </input>
      {openSearch && <section ref={searchSectionRef} style={{backgroundColor: theme.palette.background.paper}} className="border absolute w-full whitespace-nowrap shadow-xl rounded-xl">
        <div className="mt-1"></div>
        {users.map(user => (
          <Link to={`/profile/${user?.userId}`} key={user?.userId}>
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
        ))}
        <div onClick={() => navigate(`/search?query=${inputRef?.current?.value}`)} className="cursor-pointer">
          <h1 className="p-2 text-center">Search more...</h1>
        </div>
      </section>}
    </div>
  )
}

export default SearchUser