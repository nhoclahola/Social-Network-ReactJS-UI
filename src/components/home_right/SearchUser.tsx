import axios from "axios";
import React, { useCallback } from 'react'
import { API_BASE_URL } from "../../config/api";
import User from "../../utils/UserInterface";
import lodash from "lodash";
import truncateUsername from "../../utils/TruncateName";
import SearchIcon from '@mui/icons-material/Search';
import { Divider } from "@mui/material";
import { Link } from "react-router-dom";

const SearchUser = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [openSearch, setOpenSearch] = React.useState<boolean>(false);

  const searchUser = (query: string) => {
    if (query.length > 0)
      axios.get(`/api/users/search`, {
        params: {
          query: query
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
      <input onFocus={handleInputChange} onChange={handleInputChange} className="w-full p-2 rounded-lg border-[2px]" type="text" placeholder="Search" >
      </input>
      {openSearch && <section ref={searchSectionRef} className="border absolute w-full bg-white whitespace-nowrap shadow-xl rounded-xl">
        <div className="mt-1"></div>
        {users.map(user => (
          <Link to={`/profile/${user?.userId}`} key={user?.userId}>
            <div className="hover:bg-slate-200 flex items-center gap-4 p-2">
              <SearchIcon />
              <div className="flex flex-col">
                <h1 className="font-bold">{truncateUsername(user?.firstName + " " + user?.lastName, 12)}</h1>
                <h1>@{truncateUsername(user?.username, 10)}</h1>
              </div>
            </div>
            <Divider />
          </Link>
        ))}
        <div className="cursor-pointer">
          <h1 className="p-2 text-center">Search more...</h1>
        </div>
      </section>}
    </div>
  )
}

export default SearchUser