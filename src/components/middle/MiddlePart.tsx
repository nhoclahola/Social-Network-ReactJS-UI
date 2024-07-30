import { Avatar, Card, IconButton } from "@mui/material"
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import StoryCircle from "./StoryCircle";
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ArticleIcon from '@mui/icons-material/Article';
import PostCard from "./post/PostCard";
import CreatePostModal from "../create_post/CreatePostModal";

const MiddlePart = () => {
  const stories = [1, 1, 1, 1, 1,];
  const posts = [1, 1, 1, 1, 1];

  // Post modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="space-y-4">
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
        { posts.map((item) => <PostCard/>) }
      </div>

      {/* Modal */}
      <CreatePostModal open={open} handleClose={handleClose}></CreatePostModal> 
    </div>
  )
}

export default MiddlePart