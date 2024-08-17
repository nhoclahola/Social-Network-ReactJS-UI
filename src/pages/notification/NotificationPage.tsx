import React from 'react'
import Notification from "./Notification"
import { Box, Tab, Tabs } from "@mui/material"
import NotificationInterface from "../../utils/NotificationInterface"

interface NotificationProps {
  notifications: NotificationInterface[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationInterface[]>>;
  loadingNotifications: boolean;
}

const NotificationPage = ({notifications, setNotifications, loadingNotifications}: NotificationProps) => {
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
            return <Notification key={index} notification={notification}></Notification>
          })
        }
      </div>
      
      <h1 className="mb-4 text-center font-serif text-cyan-700 py-2 px-4 cursor-pointer">See more notifications</h1>
    </div>
  )
}

export default NotificationPage