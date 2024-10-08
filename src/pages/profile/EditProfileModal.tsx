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
      window.location.reload();
    }
  })

  const onCloseModal = () => {
    handleClose();
    setError(null); // Clear error state
  };

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