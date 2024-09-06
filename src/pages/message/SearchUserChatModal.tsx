import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchUserChat from "./SearchUserChat";
import ChatInterface from "../../utils/ChatInterface";

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
};

interface SearchUserChatModalProps {
  open: boolean;
  handleClose: () => void;
  setChats: React.Dispatch<React.SetStateAction<ChatInterface[]>>
};

export default function SearchUserChatModal({open, handleClose, setChats}: SearchUserChatModalProps) {

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
            <div className="flex flex-col items-center gap-y-5 h-[60vh]">
              <h1 className="font-bold font-serif text-xl">Find a user to communicate</h1>
              <SearchUserChat setChats={setChats} />
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}