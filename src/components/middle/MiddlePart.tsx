import { Grid } from "@mui/material"
import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import VideoPage from "../../pages/video/VideoPage"
import Profile from "../../pages/profile/Profile"
import HomeRight from "../home_right/HomeRight"
import { useAppDispatch, useAppSelector } from "../../redux/hook"
import MessagePage from "../../pages/message/MessagePage"
import ScrollToTop from "../../pages/home/ScrollToTop"
import SearchPage from "../../pages/search/SearchPage"
import NotificationPage from "../../pages/notification/NotificationPage"
import NotificationInterface from "../../utils/NotificationInterface"
import axios from "axios"
import Stomp from "stompjs";
import { API_BASE_URL } from "../../config/api"
import UserFollowing from "../../pages/profile/UserFollowing"
import UserFollowers from "../../pages/profile/UserFollowers"
import PostPage from "../../pages/post_page/PostPage"
import Sidebar from "../side_bar/Sidebar"
import NotificationSnackbar from "../home_right/NotificationSnackbar"
import HomePage from "../../pages/home/HomePage"
import CommunitiesPage from "../../pages/communities/CommunitiesPage"

interface MiddlePartProps {
  auth: any;
};

const MiddlePart = ({ auth }: MiddlePartProps) => {
  const location = useLocation();

  const [notReadNotificationCount, setNotReadNotificationCount] = React.useState(0);
  const [newNotification, setNewNotification] = React.useState<NotificationInterface | null>(null);

  React.useEffect(() => {
    axios.get(`/api/notifications/count_not_read`, {
      params: {
        index: 0,
      },
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then(response => {
      setNotReadNotificationCount(response.data.result);
    }).catch(error => {
      console.error(error);
    });
  }, []);

  const stompClient = useAppSelector((store) => store.stompClient.data);

  React.useEffect(() => {
    let subscription: Stomp.Subscription | null = null;
    if (stompClient && stompClient.connected) {
      subscription = stompClient?.subscribe(`/user/${auth?.user.userId}/notification/private`, (message) => {
        const newMessage = message.body;
        setNotReadNotificationCount((prev) => prev + 1);
        setNewNotification(JSON.parse(newMessage));
      }, {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      });
    }
    // Cleanup function to disconnect STOMP client when component unmounts
    return () => {
      if (subscription) {
        subscription?.unsubscribe();
      }
    };
  }, [stompClient]);

  // Notification Snackbar
  const [openNotificationSnackbar, setOpenNotificationSnackbar] = React.useState(false);

  React.useEffect(() => {
    if (newNotification) {
      setOpenNotificationSnackbar(true);
    }
  }, [newNotification]);

  return (
    <Grid container spacing={0} className="h-full">
      <Grid item xs={0} sx={{ display: { xs: 'none', md: 'block' } }} md={3}>
        <div className="sticky top-0">
          <Sidebar notReadNotificationCount={notReadNotificationCount}></Sidebar>
        </div>
      </Grid>

      <Grid item className="flex justify-center" xs={12} md={location.pathname === "/messages" ? 9 : 6}>
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="videos" element={<VideoPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="notifications" element={<NotificationPage setNotReadNotificationCount={setNotReadNotificationCount} newNotification={newNotification} />} />
          <Route path="communities" element={<CommunitiesPage />} />
          <Route path="messages" element={<MessagePage />} />
          <Route path="profile/:userId/*" element={<Profile />}>
            {/* replace the current history, so it does not save /profile/:id in history */}
            {/* <Route index path="*" element={<Navigate to="posts" replace/>}/>  */}
          </Route>
          <Route path="profile/:userId/following" element={<UserFollowing />} />
          <Route path="profile/:userId/followers" element={<UserFollowers />} />
          <Route path="post/:postId" element={<PostPage />} />
          <Route path="*" element={auth.user ? <Navigate to="" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </Grid>

      {/* {location.pathname === "/" && <Grid item lg={3} className="">
          <div className="sticky top-0 w-full">
            <HomeRight></HomeRight>
          </div>
        </Grid>} */}
      {location.pathname !== "/messages" &&
        <Grid item xs={0} md={3} sx={{ display: { xs: 'none', md: 'block' } }} className="">
          <div className="sticky top-0 w-full">
            <HomeRight></HomeRight>
          </div>
        </Grid>}
      
      {(openNotificationSnackbar && newNotification) && <NotificationSnackbar key={newNotification.notificationId} open={openNotificationSnackbar} setOpen={setOpenNotificationSnackbar} notification={newNotification} />}
    </Grid>
  )
}

export default MiddlePart