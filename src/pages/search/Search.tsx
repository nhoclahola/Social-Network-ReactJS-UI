import React from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SearchIcon from '@mui/icons-material/Search';
import UserCard from "./UserCard";
import User from "../../utils/UserInterface";
import Post from "../../utils/PostInterface";
import PostCard from "../../components/middle/post/PostCard";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingPost from "../../components/middle/loading_post/LoadingPost";
import { IconButton } from "@mui/material";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const searchTerm = query.get('query'); // Truy cập giá trị của query

  const [inputSearch, setInputSearch] = React.useState<string>(searchTerm ?? "");
  const onChangeInputSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(event.target.value);
  };

  const [users, setUsers] = React.useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = React.useState<boolean>(false);
  const [errorUsers, setErrorUsers] = React.useState<boolean>(false);
  const [usersIndex, setUsersIndex] = React.useState<number>(0);
  const [endOfUsers, setEndOfUsers] = React.useState<boolean>(true);

  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = React.useState<boolean>(false);
  const [errorPosts, setErrorPosts] = React.useState<boolean>(false);
  const [postsIndex, setPostsIndex] = React.useState<number>(0);
  const [endOfPosts, setEndOfPosts] = React.useState<boolean>(true);

  const searchUser = (query: string, index: number) => {
    setLoadingUsers(true);
    setEndOfUsers(false);
    axios.get(`/api/users/search`, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      },
      params: {
        query: query,
        index: index,
      }
    }).then((response) => {
      setUsers((prev) => {
        const newUsers = response.data.result.filter(
          (newUser: User) => !prev.some((prevUser) => prevUser.userId === newUser.userId)
        );
        if (newUsers.length < 5)
          setEndOfUsers(true);

        if (index != 0)
          return [...prev, ...newUsers];
        else
          return newUsers
      })
      setLoadingUsers(false);
    }).catch((error) => {
      setErrorUsers(true);
      setLoadingUsers(false);
    });
  }

  const searchPost = (query: string, index: number) => {
    setLoadingPosts(true);
    setEndOfPosts(false);
    axios.get(`/api/posts/search`, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      },
      params: {
        query: query,
        index: index,
      }
    }).then((response) => {
      setPosts((prev) => {
        const newPosts = response.data.result.filter(
          (newPost: Post) => !prev.some((prevPost) => prevPost.postId === newPost.postId)
        );
        if (newPosts.length < 5)
          setEndOfPosts(true);

        if (index != 0)
          return [...prev, ...newPosts];
        else
          return newPosts
      });
      setLoadingPosts(false);
    }).catch((error) => {
      setErrorPosts(true);
      setLoadingPosts(false);
    });
  }

  const resetState = () => {
    setUsers([]);
    setPosts([]);
    setEndOfUsers(true);
    setEndOfPosts(true);
    setUsersIndex(0);
    setPostsIndex(0);
  }

  React.useEffect(() => {
    if (searchTerm) {
      resetState();
      searchUser(searchTerm, 0);
      searchPost(searchTerm, 0);
    }
  }, [searchTerm])

  const handleLoadMoreUsers = () => {
    setUsersIndex(usersIndex + 5);
  };

  const handleLoadMorePosts = () => {
    setPostsIndex(postsIndex + 10);
  };

  React.useEffect(() => {
    if (usersIndex > 0 && searchTerm) {
      searchUser(searchTerm, usersIndex);
    }
  }, [usersIndex]);

  React.useEffect(() => {
    if (postsIndex > 0 && searchTerm) {
      searchPost(searchTerm, postsIndex);
    }
  }, [postsIndex]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value.length > 0) {
      event.preventDefault();
      // addMessage(event.currentTarget.value);
      navigate(`/search?query=${event.currentTarget.value}`);
      // event.currentTarget.value = "";
    }
  };

  return (
    <div className="mt-2 w-full mx-5 space-y-8">
      <section className="flex justify-center items-center space-x-4">
        <IconButton className="hover:text-cyan-500" onClick={() => {
          resetState();
          setInputSearch("");
          navigate("/search");
        }} >
          <KeyboardBackspaceIcon />
        </IconButton>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            value={inputSearch}
            onChange={onChangeInputSearch}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>
      <section className="space-y-3">
        {users.length > 0 && <h1 className="font-bold font-mono text-xl">People:</h1>}
        <div className="flex flex-col gap-y-2">
          {users.map((user) => <UserCard user={user} />)}
        </div>
        {loadingUsers && <LoadingPost />}
        {(!endOfUsers && !loadingUsers) && <h1 onClick={handleLoadMoreUsers} className="mb-4 text-center font-serif text-cyan-700 py-2 px-4 cursor-pointer">See more people</h1>}
      </section>
      <section className="space-y-3">
        {posts.length > 0 && <h1 className="font-bold font-mono text-xl">Posts & Videos:</h1>}
        <div className="flex flex-col gap-y-2">
          {posts.map((item) => <PostCard key={item.postId} postId={item.postId} caption={item.caption}
            createdAt={item.createdAt} imageUrl={item.imageUrl} videoUrl={item.videoUrl} user={item.user} likedCount={item.likedCount}
            commentCount={item.commentCount} liked={item.liked} />)}
        </div>
        {loadingPosts && <LoadingPost />}
        {(!endOfPosts && !loadingPosts) && <h1 onClick={handleLoadMorePosts} className="mb-4 text-center font-serif text-cyan-700 py-2 px-4 cursor-pointer">See more posts & videos</h1>}
      </section>
    </div>
  )
}

export default Search