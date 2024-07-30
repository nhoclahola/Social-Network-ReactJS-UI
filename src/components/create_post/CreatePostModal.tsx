import { Avatar, Backdrop, Box, Button, Fade, Icon, IconButton, Modal, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from 'react'
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

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
  const formik = useFormik<FormValues>({
    initialValues: {
      caption: "",
    },
    onSubmit: (values) => {
      console.log("values", values);
    }
  });

  const [image, setImage] = React.useState<File | null>(null);
  const [video, setVideo] = React.useState<File | null>(null);

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
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
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
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [video]);

  return (
    <div>
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
          <Box sx={style}>
            <form className="space-y-5" onSubmit={formik.handleSubmit}>
              <div className="flex gap-x-4 items-center">
                <Avatar></Avatar>
                <div>
                  <p className="font-bold text-lg">nhoclahola</p>
                  <p className="text-sm">@nhoclahola</p>
                </div>
              </div>
              <textarea className="w-full p-4 resize-none border border-black rounded-lg" name="caption" value={formik.values.caption}
                onChange={formik.handleChange}
                placeholder="aaaa" rows={4}></textarea>
              <div className="flex gap-x-5 items-center mt-5">
                <div>
                  <input className="hidden" placeholder="image" id="image-input" type="file" accept="image/*" onChange={handleImageChange} ></input>
                  <label htmlFor="image-input">
                    {/* <IconButton color="primary"> */}
                      <ImageIcon></ImageIcon>
                    {/* </IconButton> */}
                  </label>
                  <span>Image</span>
                </div>
                <div>
                  <input className="hidden" placeholder="video" id="video-input" type="file" accept="video/*" onChange={handleVideoChange} ></input>
                  <label htmlFor="video-input">
                    <IconButton color="primary">
                      <VideoLibraryIcon></VideoLibraryIcon>
                    </IconButton>
                  </label>
                  <span>Image</span>
                </div>
              </div>
              {image && <img src={URL.createObjectURL(image)} title="Image" className="h-[10rem]"></img>}
              <div className="flex w-full justify-end">
                <Button variant="outlined" type="submit" sx={{borderRadius: "1.5rem"}}>Post</Button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default CreatePostModal