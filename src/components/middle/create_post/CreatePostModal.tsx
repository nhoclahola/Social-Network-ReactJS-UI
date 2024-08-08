import { Avatar, Backdrop, Box, Button, CircularProgress, Fade, Icon, IconButton, Modal, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from 'react'
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { uploadPostThunk } from "../../../redux/post/post.action";
import { error } from "console";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: ".6rem",
};

export interface CreatePostModalProps {
  open: boolean;
  handleClose: () => void;
  addPost: (post: any) => void;
}

interface FormValues {
  caption: string;
};

interface Post {
  postId: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
  user: User;
};

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: boolean;
};

const CreatePostModal = ({ open, handleClose, addPost }: CreatePostModalProps) => {
  const auth = useAppSelector((store) => store.auth);

  const [data, setData] = React.useState<Post | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<any>(null);

  const [image, setImage] = React.useState<File | null>(null);
  // const [video, setVideo] = React.useState<File | null>(null);

  const [imageObjectUrl, setImageObjectUrl] = React.useState<string | undefined>(undefined);
  // const [videoObjectUrl, setVideoObjectUrl] = React.useState<string | undefined>(undefined);

  const formik = useFormik<FormValues>({
    initialValues: {
      caption: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('caption', values.caption);
      // If either image or video is null, append an empty file to prevent error
      const emptyFile = new File([], '');
      formData.append('image', image || emptyFile);
      axios.post(`${API_BASE_URL}/api/posts`, formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "multipart/form-data"
        }
      }).then((response) => {
        setData(response.data.result);
        addPost(response.data.result);
        setLoading(false);
        closeModal();
      }).catch((error) => {
        console.error("error", error);
        setError(error);
        setLoading(false);
      });
    }
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  // Clean up if image change

  React.useEffect(() => {
    let objectUrl: string | null = null;
    if (image) {
      objectUrl = URL.createObjectURL(image);
      setImageObjectUrl(objectUrl);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        console.log("revoked image url", objectUrl);
      }
    };
  }, [image]);

  // const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     setVideo(event.target.files[0]);
  //   }
  // };

  // React.useEffect(() => {
  //   let objectUrl: string | null = null;
  //   if (video) {
  //     objectUrl = URL.createObjectURL(video);
  //     setVideoObjectUrl(objectUrl);
  //   }
  //   return () => {
  //     if (objectUrl) {
  //       URL.revokeObjectURL(objectUrl);
  //       console.log("revoked video url", objectUrl);
  //     }
  //   };
  // }, [video]);

  // Clear when close modal
  const closeModal = () => {
    setImage(null);
    setError(null);
    formik.resetForm();
    handleClose();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={closeModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <form className="space-y-5" onSubmit={formik.handleSubmit}>
              <div className="flex gap-x-4 items-center">
                <Avatar>
                  {auth?.user?.avatarUrl && <img src={auth?.user?.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
                </Avatar>
                <div>
                  <p className="font-bold text-lg">{auth?.user?.firstName} {auth?.user?.lastName}</p>
                  <p className="text-sm">@{auth?.user?.username}</p>
                </div>
              </div>
              <div>
                <textarea className="w-full p-4 resize-none border border-black rounded-lg bg-transparent" name="caption" value={formik.values.caption}
                  onChange={formik.handleChange}
                  placeholder="Caption..." rows={4} />
                {error && <Typography color="error">Error: {error?.message}</Typography>}
              </div>
              <div className="flex gap-x-5 items-center mt-5">
                <div>
                  <input className="hidden" placeholder="image" id="image-input" type="file" accept="image/*" onChange={handleImageChange} ></input>
                  <label htmlFor="image-input">
                    <IconButton color="primary" component="span">
                      <ImageIcon></ImageIcon>
                    </IconButton>
                  </label>
                  <span>Image</span>
                </div>
                {/* <div>
                  <input className="hidden" placeholder="video" id="video-input" type="file" accept="video/*" onChange={handleVideoChange} ></input>
                  <label htmlFor="video-input">
                    <IconButton color="primary" component="span">
                      <VideoLibraryIcon></VideoLibraryIcon>
                    </IconButton>
                  </label>
                  <span>Video</span>
                </div> */}
              </div>
              <div className="flex justify-start gap-x-4 flex-wrap">
                {image && <img src={imageObjectUrl} title="Image" className="h-[10rem]"></img>}
                {/* {video && <video src={videoObjectUrl} title="Video" controls className="h-[10rem]"></video>} */}
              </div>
              <div className="flex w-full justify-end">
                <Button variant="outlined" type="submit" sx={{ borderRadius: "1.5rem" }}>Post</Button>
              </div>
            </form>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default CreatePostModal