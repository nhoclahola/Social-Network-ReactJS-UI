import { Avatar, IconButton, Tooltip, useTheme } from "@mui/material"
import React from 'react'
import NotificationInterface from "../../utils/NotificationInterface"
import formatDateFromString from "../../utils/ConvertDate";
import truncateUsername from "../../utils/TruncateName";
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { Link } from "react-router-dom";

interface NotificationProps {
  notification: NotificationInterface;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationInterface[]>>;
  setNotReadNotificationCount: React.Dispatch<React.SetStateAction<number>>;
};

const Notification = ({ notification, setNotifications, setNotReadNotificationCount }: NotificationProps) => {
  const theme = useTheme();
  const markNotificationAsRead = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    axios.put(`/api/notifications/${notification.notificationId}/read`, {}, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then(response => {
      setNotifications((prev) => {
        return prev.map((prevNotification) => {
          if (prevNotification.notificationId === notification.notificationId) {
            return { ...prevNotification, read: true };
          }
          return prevNotification;
        })
      })
      setNotReadNotificationCount((prev) => prev - 1);
    }).catch(error => {
      console.error(error);
    });
  }
  return (
    <Link to={`/post/${notification.post.postId}`} style={{ background: theme.palette.background.paper }} className="flex items-center w-full justify-between hover:bg-transparent cursor-pointer shadow p-2">
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
      </div>
      {
        !notification.read &&
        <Tooltip title="Mark Notification as read">
          <IconButton onClick={markNotificationAsRead} className="hover:text-cyan-500">
            <MarkEmailReadIcon className="text-end" />
          </IconButton>
        </Tooltip>
      }
    </Link>
  )
}

export default Notification