import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import NotificationInterface from "../../utils/NotificationInterface";
import { Avatar, Slide, SlideProps, SnackbarContent, useTheme } from "@mui/material";
import formatDateFromString from "../../utils/ConvertDate";
import truncateUsername from "../../utils/TruncateName";
import { Link } from "react-router-dom";
import { TransitionProps } from "@mui/material/transitions";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const transition: React.ComponentType<
  TransitionProps & {
    children: React.ReactElement<any, any>;
  }
> = SlideTransition;

interface NotificationSnackbarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  notification: NotificationInterface;
  key: string;
}

export default function NotificationSnackbar({ key, open, setOpen, notification }: NotificationSnackbarProps) {
  const theme = useTheme();

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (event)
      event.preventDefault();
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      key={key}
      sx={{ width: 360 }}
      TransitionComponent={transition}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      autoHideDuration={15000}
      onClose={handleClose}
    >
      <SnackbarContent style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }} message={
        <Link to={`/notifications`} className="flex items-center w-full justify-between hover:bg-transparent cursor-pointer shadow p-2">
          <div className="flex items-center gap-x-2">
            {!notification.read ? <div className="w-2 h-2 bg-cyan-500 rounded-full"></div> : <div className="w-2 h-2"></div>}
            <Avatar sx={{ width: "3rem", height: "3rem" }}>
              {notification.triggerUser?.avatarUrl && <img src={notification.triggerUser.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
            </Avatar>
            <div>
              {
                notification.notificationType === "LIKE" ?
                  <h3><span className="font-bold">@{notification.triggerUser.username}</span> liked your post: <span className="font-bold">{truncateUsername(notification.post.caption, 30)}</span></h3> :
                  notification.notificationType === "COMMENT" ?
                    <h3><span className="font-bold">@{notification.triggerUser.username}</span> commented your post.</h3> : null
              }
              <p className="text-sm">{formatDateFromString(notification.createdAt)}</p>
            </div>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </Link>
      } />
    </Snackbar>
  );
}
