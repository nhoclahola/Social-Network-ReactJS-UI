import React from 'react'
import Notification from "./Notification"
import { Box, Tab, Tabs } from "@mui/material"
import NotificationInterface from "../../utils/NotificationInterface"
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import LoadingPost from "../../components/middle/loading_post/LoadingPost";

interface NotificationProps {
  setNotReadNotificationCount: React.Dispatch<React.SetStateAction<number>>;
}

const NotificationPage = ({setNotReadNotificationCount}: NotificationProps) => {
  const [notifications, setNotifications] = React.useState<NotificationInterface[]>([]);
  const [loadingNotifications, setLoadingNotifications] = React.useState(true);
  const [errorNotifications, setErrorNotifications] = React.useState(null);
  const [index, setIndex] = React.useState(0);
  const [endOfNotifications, setEndOfNotifications] = React.useState(false);

  React.useEffect(() => {
    setLoadingNotifications(true);
    axios.get(`/api/notifications/users`, {
      params: {
        index: index,
      },
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then(response => {
      setNotifications((prev) => {
        const newNotifications = response.data.result.filter(
          (newNotification: NotificationInterface) => !prev.some((prevComment) => prevComment.notificationId === newNotification.notificationId)
        );
        if (newNotifications.length < 10)
          setEndOfNotifications(true);
        else
          setEndOfNotifications(false);
        return [...prev, ...newNotifications];
      })
      setLoadingNotifications(false);
    }).catch(error => {
      setErrorNotifications(error);
      setLoadingNotifications(false);
    });
  }, [index]);

  const handleLoadMore = () => {
    if (!endOfNotifications)
      setIndex((prev) => prev + 10);
  }

  return (
    <div className="w-full mx-5">
      <h1 className="font-bold font-serif text-xl mt-2 mb-5">Notifications</h1>
      {/* <Box sx={{ width: '100%', borderBottom: 1, borderColor: "divider" }}>
        <Tabs aria-label="wrapped label tabs example">
          <Tab label="test"></Tab>
        </Tabs>
      </Box> */}
      <div className="space-y-2">
        {
          notifications.map((notification, index) => {
            return <Notification key={index} notification={notification} setNotifications={setNotifications} setNotReadNotificationCount={setNotReadNotificationCount}></Notification>
          })
        }
      </div>
      {loadingNotifications && <LoadingPost />}
      {(!loadingNotifications && !endOfNotifications) && <h1 onClick={handleLoadMore} className="mb-4 text-center font-serif text-cyan-700 py-2 px-4 cursor-pointer">See more notifications</h1>}
    </div>
  )
}

export default NotificationPage