import { Avatar, Card, Divider, IconButton } from "@mui/material"
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ArticleIcon from '@mui/icons-material/Article';
import PostCard from "./post/PostCard";
import CreatePostModal from "./create_post/CreatePostModal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { getHomePagePostThunk } from "../../redux/post/post.action";
import LoadingPost from "./loading_post/LoadingPost";
import EndOfPage from "./end_of_page/EndOfPage";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import Post from "../../utils/PostInterface";
import User from "../../utils/UserInterface";
import LatestActivityFollowings from "./LatestActivityFollowings";

const MiddlePart = () => {
  const auth = useAppSelector((store) => store.auth);

  const [latestActivityFollowingsUsers, setLatestActivityFollowingsUsers] = React.useState<User[]>([]);
  const [loadingLatestActivityFollowingsUsers, setLoadingLatestActivityFollowingsUsers] = React.useState(true);
  const [errorLatestActivityFollowingsUsers, setErrorLatestActivityFollowingsUsers] = React.useState(null);

  React.useEffect(() => {
    setLoadingLatestActivityFollowingsUsers(true);
    axios.get(`/api/users/latest-activity-followings`, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then((response) => {
      setLatestActivityFollowingsUsers(response.data.result);
      setLoadingLatestActivityFollowingsUsers(false);
    }).catch((error) => {
      setErrorLatestActivityFollowingsUsers(error);
      setLoadingLatestActivityFollowingsUsers(false);
    })
  }, []);

  // Post modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [followingIndex, setFollowingIndex] = React.useState(0);
  const [randomIndex, setRandomIndex] = React.useState(0);

  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [endOfPage, setEndOfPage] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`/api/posts/homepage`, {
      params: {
        followingIndex: followingIndex,
        randomIndex: randomIndex
      },
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    })
      .then(response => {
        setPosts((prev) => {
          // To check duplicate, in the end, the random new Post will duplicate
          const newPosts = response.data.result.filter(
            (newPost: Post) => !prev.some((prevPost) => prevPost.postId === newPost.postId)
          );
          if (newPosts.length < 1) {
            window.removeEventListener('scroll', checkScrollPosition);
            setEndOfPage(true);
          }
          return [...prev, ...newPosts];
        });
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [followingIndex, randomIndex]);

  // To debug
  React.useEffect(() => {
    console.log("posts", posts);

  }, [posts]);


  const checkScrollPosition = React.useCallback(() => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if user scrolled to the bottom of the page
    if (scrollTop + windowHeight >= documentHeight) {
      window.scrollBy(0, -400);
      setFollowingIndex((prev) => prev + 10);
      setRandomIndex((prev) => prev + 2);
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener('scroll', checkScrollPosition);
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  // Add post when user create new Post
  const addPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  }

  return (
    <div className="space-y-4 w-full px-5">
      <Card className="flex items-center space-x-4 p-5 rounded-b-md">
        {
          loadingLatestActivityFollowingsUsers ? <LoadingPost /> :
            latestActivityFollowingsUsers.map((item) => <LatestActivityFollowings key={item.userId} user={item} ></LatestActivityFollowings>)
        }
      </Card>
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <Avatar className="mr-6 outline outline-2 outline-slate-300">
            {auth.user?.avatarUrl && <img src={auth.user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
          </Avatar>
          <input
            onClick={handleOpen}
            readOnly
            className="w-[90%] bg-transparent rounded-full p-5 border hover:outline-none hover:ring-2 hover:ring-blue-500 cursor-pointer"
            type="text"
            placeholder="What are you thinking?"></input>
        </div>
      </Card>
      <div className="space-y-6">
        {posts.map((item) => <PostCard key={item.postId} post={item} />)}
      </div>

      {endOfPage ? <EndOfPage /> : <LoadingPost />}

      {/* Modal */}
      <CreatePostModal open={open} handleClose={handleClose} addPost={addPost}></CreatePostModal>
    </div>
  )
}

export default MiddlePart