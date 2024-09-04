import { Avatar, Card } from "@mui/material"
import React from 'react'
import PostCard from "../../components/middle/post/PostCard";
import CreatePostModal from "../../components/middle/create_post/CreatePostModal";
import { useAppSelector } from "../../redux/hook";
import EndOfPage from "../../components/middle/end_of_page/EndOfPage";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import Post from "../../utils/PostInterface";
import LoadingPost from "../../components/middle/loading_post/LoadingPost";

const CommunitiesPage = () => {
  const auth = useAppSelector((store) => store.auth);

  // Post modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [index, setIndex] = React.useState(0);

  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [endOfPage, setEndOfPage] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`/api/posts/communities`, {
      params: {
        index: index,
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
          if (newPosts.length < 10) {
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
  }, [index]);

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
      setIndex((prev) => prev + 10);
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

      {!endOfPage && <LoadingPost /> }

      {/* Modal */}
      <CreatePostModal open={open} handleClose={handleClose} addPost={addPost}></CreatePostModal>
    </div>
  )
}

export default CommunitiesPage