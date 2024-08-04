import { Avatar, Card, IconButton } from "@mui/material"
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import StoryCircle from "./StoryCircle";
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ArticleIcon from '@mui/icons-material/Article';
import PostCard from "./post/PostCard";
import CreatePostModal from "./create_post/CreatePostModal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { getHomePagePostThunk } from "../../redux/post/post.action";
import LoadingPost from "./loading_post/LoadingPost";
import EndOfPage from "./end_of_page/EndOfPage";

interface User {
  userId: string;
	email: string;
	firstName: string;
	lastName: string;
  gender: string;
};

interface Post {
  postId: string;
  caption: string;
	createdAt: string;
	imageUrl: string;
	user: User;
  likedCount: number;
  commentCount: number;
};

const MiddlePart = () => {
  const stories = [1, 1, 1, 1, 1,];
  const dispatch = useAppDispatch();
  const post = useAppSelector((store) => store.post);
  const [posts, setPosts] = React.useState<Post[]>([]);
  

  // Post modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [followingIndex, setFollowingIndex] = React.useState(0);
  const [randomIndex, setRandomIndex] = React.useState(0);

  const [endOfPage, setEndOfPage] = React.useState(false);

  React.useEffect(() => {
   dispatch(getHomePagePostThunk(followingIndex, randomIndex));
  }, [followingIndex, randomIndex]);

  React.useEffect(() => {
    if (post.data) {
      setPosts((prev) => {
        // To check duplicate, in the end, the random new Post will duplicate
        const newPosts = post.data.result.filter(
          (newPost: any) => !prev.some((prevPost) => prevPost.postId === newPost.postId)
        );
        if (newPosts.length === 0) {
          window.removeEventListener('scroll', checkScrollPosition);
          setEndOfPage(true);
        }
        return [...prev, ...newPosts];
      });
    } 
  }, [post.data]);


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
    <div className="space-y-4 w-full">
      <Card className="flex items-center space-x-4 p-5 rounded-b-md">
        <div className="flex flex-col items-center cursor-pointer">
          <Avatar sx={{width: "4rem", height: "4rem"}}>
            <AddIcon sx={{fontSize: "3rem"}}></AddIcon>
          </Avatar>
          <p>New</p>
        </div>
        {
          stories.map((item) => <StoryCircle></StoryCircle>)
        }
      </Card>
      <Card className="p-5">
        <div className="flex justify-between items-center">
          <Avatar></Avatar>
          <input 
            onClick={handleOpen}
            readOnly
            className="w-[90%] bg-transparent rounded-full p-5 border-[#3b4054] border hover:bg-slate-600 cursor-pointer" 
            type="text" 
            placeholder="What are you thinking?"></input>
        </div>
        <div className="flex justify-center space-x-5 mt-5">
          <div className="flex items-center">
            <IconButton color="primary" className="w-20" onClick={handleOpen}>
              <ImageIcon></ImageIcon>
            </IconButton>
            <span>Media</span>
          </div>
          <div className="flex items-center">
            <IconButton color="primary" className="w-20" onClick={handleOpen}>
              <VideoLibraryIcon></VideoLibraryIcon>
            </IconButton>
            <span>Video</span>
          </div>
          <div className="flex items-center">
            <IconButton color="primary" className="w-20" onClick={handleOpen}>
              <ArticleIcon></ArticleIcon>
            </IconButton>
            <span>Article</span>
          </div>
        </div>
      </Card>
      <div className="space-y-5">
        { posts.map((item) => <PostCard key={item.postId} postId={item.postId} caption={item.caption} 
          createdAt={item.createdAt} imageUrl={item.imageUrl} user={item.user} likedCount={item.likedCount} 
          commentCount={item.commentCount}/>) }
      </div>

      { endOfPage ? <EndOfPage /> : <LoadingPost /> }

      {/* Modal */}
      <CreatePostModal open={open} handleClose={handleClose} addPost={addPost}></CreatePostModal> 
    </div>
  )
}

export default MiddlePart