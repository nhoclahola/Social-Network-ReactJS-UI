import { Avatar } from "@mui/material"
import React from 'react'
import NotificationInterface from "../../utils/NotificationInterface"
import formatDateFromString from "../../utils/ConvertDate";
import truncateUsername from "../../utils/TruncateName";

interface NotificationProps {
  notification: NotificationInterface;
};

const Notification = ({ notification }: NotificationProps) => {
  return (
    <div className="flex items-center gap-x-2 shadow p-2 bg-white hover:bg-transparent cursor-pointer">
      {!notification.read ? <div className="w-2 h-2 bg-cyan-500 rounded-full"></div> : <div className="w-2 h-2"></div>}
      <Avatar sx={{ width: "3rem", height: "3rem" }}>
        {notification.triggerUser?.avatarUrl && <img src={notification.triggerUser.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
      </Avatar>
      <div>
        {
          notification.notificationType === "LIKE" ?
            <h3><span className="font-bold">@{notification.triggerUser.username}</span> liked your post: <span className="font-bold">{truncateUsername(notification.post.caption, 40)}</span></h3> :
            notification.notificationType === "COMMENT" ?
              <h3><span className="font-bold">@{notification.triggerUser.username}</span> commented your post.</h3> : null
        }
        <p className="text-sm">{formatDateFromString(notification.createdAt)}</p>
      </div>
    </div>
  )
}

export default Notification