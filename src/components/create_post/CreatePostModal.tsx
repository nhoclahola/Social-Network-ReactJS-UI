import { Avatar, Backdrop, Box, Button, CircularProgress, Fade, Icon, IconButton, Modal, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from 'react'
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { uploadPostThunk } from "../../redux/post/post.action";
import { error } from "console";

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
}

interface FormValues {
  caption: string;
}

const CreatePostModal = ({ open, handleClose }: CreatePostModalProps) => {
  const upload = useAppSelector((store: RootState) => store.upload)
  const dispatch = useAppDispatch();
  const formik = useFormik<FormValues>({
    initialValues: {
      caption: "",
    },
    onSubmit: async (values) => {
      await dispatch(uploadPostThunk(values.caption, image, video));
    }
  });

  const [isError, setIsError] = React.useState(false);

  // Maybe dispatch have done but state haven't update yet even I await dispatch because state update in Redux is separate from dispatch
  React.useEffect(() => {
    if (upload.error) 
      setIsError(true);
    else
      setIsError(false);
  }, [upload.error]);

  React.useEffect(() => {
    if (upload.data)
      closeModal();
  }, [upload.data]);

  const [image, setImage] = React.useState<File | null>(null);
  const [video, setVideo] = React.useState<File | null>(null);

  const [imageObjectUrl, setImageObjectUrl] = React.useState<string | undefined>(undefined);
  const [videoObjectUrl, setVideoObjectUrl] = React.useState<string | undefined>(undefined);


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

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVideo(event.target.files[0]);
    }
  };

  React.useEffect(() => {
    let objectUrl: string | null = null;
    if (video) {
      objectUrl = URL.createObjectURL(video);
      setVideoObjectUrl(objectUrl);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        console.log("revoked video url", objectUrl);
      }
    };
  }, [video]);

  // Clear when close modal
  const closeModal = () => {
    setImage(null);
    setVideo(null);
    setIsError(false);
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
                <Avatar></Avatar>
                <div>
                  <p className="font-bold text-lg">nhoclahola</p>
                  <p className="text-sm">@nhoclahola</p>
                </div>
              </div>
              <div>
                <textarea className="w-full p-4 resize-none border border-black rounded-lg bg-transparent" name="caption" value={formik.values.caption}
                  onChange={formik.handleChange}
                  placeholder="Caption..." rows={4}/>
                { isError && <Typography color="error">Error: {upload.error?.response?.data?.message}</Typography> }
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
                <div>
                  <input className="hidden" placeholder="video" id="video-input" type="file" accept="video/*" onChange={handleVideoChange} ></input>
                  <label htmlFor="video-input">
                    <IconButton color="primary" component="span">
                      <VideoLibraryIcon></VideoLibraryIcon>
                    </IconButton>
                  </label>
                  <span>Video</span>
                </div>
              </div>
              <div className="flex justify-start gap-x-4 flex-wrap">
                {image && <img src={imageObjectUrl} title="Image" className="h-[10rem]"></img>}
                {video && <video src={videoObjectUrl} title="Video" controls className="h-[10rem]"></video>}
              </div>
              <div className="flex w-full justify-end">
                <Button variant="outlined" type="submit" sx={{ borderRadius: "1.5rem" }}>Post</Button>
              </div>
            </form>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={upload.loading}
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