import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import UserCard from "./UserCard";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import User from "../../../utils/UserInterface";
import LoadingPost from "../loading_post/LoadingPost";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: "90vw",
    sm: "70vw",
    md: "60vw",
    lg: "40vw",
    xl: "40vw",
  },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: ".6rem",
  maxHeight: "80vh",
};

interface UserLikedModalProps {
  postId: string | undefined
  open: boolean;
  handleClose: () => void;
};

export default function UserLikedModal({ postId, open, handleClose }: UserLikedModalProps) {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isEnd, setIsEnd] = React.useState(true);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`/api/posts/${postId}/users/liked`, {
      params: {
        index: index,
      },
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    })
      .then(response => {
        setUsers((prev) => {
          const newUsers = response.data.result.filter(
            (newUsers: User) => !prev.some((prevUser) => prevUser.userId === newUsers.userId)
          );
          if (newUsers.length < 10)
            setIsEnd(true);
          else
            setIsEnd(false);
          return [...prev, ...newUsers];
        });
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [index]);

  const loadMoreUsers = () => {
    setIndex((prev) => prev + 10);
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box className="space-y-4" sx={style}>
          <div className="flex justify-between items-center">
            <h1 className="font-bold font-serif">List of people who liked this post:</h1>
            <IconButton sx={{"&:hover": {backgroundColor: "red"}}} className="hover:bg-red-500" onClick={handleClose}>
              <CloseIcon></CloseIcon>
            </IconButton>
          </div>
          <div className="flex flex-col min-h-[40vh] max-h-[60vh] gap-y-2 overflow-y-auto">
            <div className="space-y-2">
              {users.map((user) => <UserCard key={user.userId} user={user} />)}
            </div>
            {!isEnd && <h1 onClick={loadMoreUsers} className="mb-4 text-center font-serif text-cyan-700 py-2 px-4 cursor-pointer">See more users</h1>}
            {loading && <LoadingPost />}
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}