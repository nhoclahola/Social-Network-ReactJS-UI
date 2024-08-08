import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useFormik } from "formik";
import { updateProfileAction, uploadAvatarThunk } from "../../redux/auth/auth.action";
import { Avatar, IconButton, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ImageIcon from '@mui/icons-material/Image';
import { API_BASE_URL } from "../../config/api";
import axios from "axios";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,

  outline: "none",
  overflow: "scroll-y",
  borderRadius: "10px",
};

export interface EditProfileModalProps {
  open: boolean;
  handleClose: () => void;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

interface FormValues {
  firstName: string;
  lastName: string;
}

const EditProfileModal = ({ open, handleClose, setUser }: EditProfileModalProps) => {
  const auth = useAppSelector((store) => store.auth);
  const [avatar, setAvatar] = React.useState<File | null>(null);
  const [cover, setCover] = React.useState<File | null>(null);
  const [avatarObjectUrl, setAvatarObjectUrl] = React.useState<string | undefined>(undefined);
  const [coverObjectUrl, setCoverObjectUrl] = React.useState<string | undefined>(undefined);


  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCover(event.target.files[0]);
    }
  };

  // Clean up if image change
  React.useEffect(() => {
    let objectUrl: string | null = null;
    if (avatar) {
      objectUrl = URL.createObjectURL(avatar);
      setAvatarObjectUrl(objectUrl);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        console.log("revoked avatar url", objectUrl);
      }
    };
  }, [avatar]);

  React.useEffect(() => {
    let objectUrl: string | null = null;
    if (cover) {
      objectUrl = URL.createObjectURL(cover);
      setCoverObjectUrl(objectUrl);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        console.log("revoked cover url", objectUrl);
      }
    };
  }, [cover]);

  const uploadAvatar = async (image: File | null) => {
    const formData = new FormData();
    // If avatar is null, append an empty file to prevent error
    const emptyFile = new File([], '');
    formData.append('image', image || emptyFile);
    axios.post(`${API_BASE_URL}/api/users/avatar`, formData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "multipart/form-data"
      }
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.error("error", error);
    });
  };

  const uploadCover = async (image: File | null) => {
    const formData = new FormData();
    // If avatar is null, append an empty file to prevent error
    const emptyFile = new File([], '');
    formData.append('image', image || emptyFile);
    axios.post(`${API_BASE_URL}/api/users/cover`, formData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "multipart/form-data"
      }
    }).then((response) => {
      console.log(response)
    }).catch((error) => {
      console.error("error", error);
    });
  };

  const errorFromStore = useSelector((state: RootState) => state.auth.error);
  const [error, setError] = React.useState<string | null>(null);

  // Update local error when error in store change

  React.useEffect(() => {
    setError(errorFromStore);
  }, [errorFromStore]);

  const dispatch = useAppDispatch();

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: auth?.user?.firstName,
      lastName: auth?.user?.lastName,
    },
    onSubmit: async (values) => {
      await dispatch(updateProfileAction(values));

      const uploadPromises = [];
      if (avatar) {
        uploadPromises.push(uploadAvatar(avatar));
      }
      if (cover) {
        uploadPromises.push(uploadCover(cover));
      }
      await Promise.all(uploadPromises);
      window.location.reload();
    }
  })

  const onCloseModal = () => {
    handleClose();
    setError(null); // Clear error state
  };

  React.useEffect(() => {
    if (avatarObjectUrl)
      console.log(avatarObjectUrl)
  }, [avatarObjectUrl]);

  React.useEffect(() => {
    if (coverObjectUrl)
      console.log(coverObjectUrl)
  }, [coverObjectUrl]);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={onCloseModal}
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
            <form onSubmit={formik.handleSubmit}>
              <div className="flex justify-end">
                <IconButton onClick={handleClose}>
                  <CloseIcon></CloseIcon>
                </IconButton>
              </div>
              <h1 className="text-center font-bold text-xl mb-5">Edit Profile</h1>
              {error && <div className="text-red-500 text-center">{error}</div>}
              <div className="relative">
                <div className="relative">
                  <input className="hidden" placeholder="image" id="cover-input" type="file" accept="image/*" onChange={handleCoverChange} ></input>
                  <div className="h-[10rem] bg-slate-400">
                    {coverObjectUrl ? <img src={coverObjectUrl} alt="cover" className="w-full h-full" /> : auth?.user?.coverPhotoUrl ? <img src={auth?.user.coverPhotoUrl} alt="cover" className="w-full h-full" /> : null}
                  </div>
                  <label className="cursor-pointer" htmlFor="cover-input">
                    <div className="absolute right-2 bottom-4 bg-slate-50 px-2 py-1 rounded-lg flex items-center hover:bg-transparent hover:text-orange-600">
                      <ImageIcon />
                      <span>Change cover</span>
                    </div>
                  </label>
                </div>
                <div className="pl-5 h-[3rem]">
                  <input className="hidden" placeholder="image" id="avatar-input" type="file" accept="image/*" onChange={handleAvatarChange} ></input>
                  <div className="absolute bottom-0.5">
                    <Avatar className="outline outline-3 outline-slate-300" sx={{ width: "8rem", height: "8rem" }}>
                      {avatarObjectUrl ? <img src={avatarObjectUrl} alt="avatar" className="h-full w-auto object-cover" /> : auth?.user?.avatarUrl ? <img src={auth?.user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" /> : null}
                    </Avatar>
                    <label htmlFor="avatar-input">
                      <IconButton sx={{ bgcolor: "#beccc2" }} className="hover:text-orange-600 absolute left-24 bottom-10" component="span" >
                        <CameraAltIcon></CameraAltIcon>
                      </IconButton>
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <TextField fullWidth id="firstName" name="firstName" label="First Name" value={formik.values.firstName} onChange={formik.handleChange} />
                <TextField fullWidth id="lastName" name="lastName" label="Last Name" value={formik.values.lastName} onChange={formik.handleChange} />
              </div>
              <div className="flex justify-end mt-5">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default EditProfileModal