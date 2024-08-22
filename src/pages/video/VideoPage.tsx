import React from 'react'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import PostCard from "../../components/middle/post/PostCard";
import Post from "../../utils/PostInterface";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { set } from "lodash";
import LoadingPost from "../../components/middle/loading_post/LoadingPost";
import EndOfVideo from "./EndOfVideo";
import { useTheme } from "@mui/material";

const VideoPage = () => {
  const [index, setIndex] = React.useState(0);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [endOfPage, setEndOfPage] = React.useState(false);
  const [resetKey, setResetKey] = React.useState(0);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`/api/posts/popular_videos`, {
      params: {
        index: index
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
          console.log("newPosts", newPosts);
          return [...prev, ...newPosts];
        });
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [index, resetKey]);

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

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setIndex(0);
    setPosts([]);
    setEndOfPage(false);
    setResetKey((prev) => prev + 1);
  };

  const theme = useTheme();
  return (
    <div className="w-full px-5">
      <div style={{backgroundColor: theme.palette.background.default}} className="flex justify-center font-bold text-2xl my-8 sticky top-0 z-10">
        <div onClick={handleScrollToTop} className="flex flex-col justify-center items-center cursor-pointer">
          <h1>Popular videos</h1>
          <OndemandVideoIcon />
        </div>
      </div>
      <div className="space-y-6">
        {posts.map((item) => <PostCard key={item.postId} postId={item.postId} caption={item.caption}
          createdAt={item.createdAt} imageUrl={item.imageUrl} videoUrl={item.videoUrl} user={item.user} likedCount={item.likedCount}
          commentCount={item.commentCount} liked={item.liked} />)}
      </div>

      {endOfPage ? <EndOfVideo /> : <LoadingPost />}
    </div>
  )
}

export default VideoPage