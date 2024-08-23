import { Grid } from "@mui/material"
import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import MiddlePart from "../../components/middle/MiddlePart"
import VideoPage from "../video/VideoPage"
import Profile from "../profile/Profile"
import HomeRight from "../../components/home_right/HomeRight"
import { useAppDispatch, useAppSelector } from "../../redux/hook"
import MessagePage from "../message/MessagePage"
import ScrollToTop from "./ScrollToTop"
import SearchPage from "../search/SearchPage"
import NotificationPage from "../notification/NotificationPage"
import NotificationInterface from "../../utils/NotificationInterface"
import axios from "axios"
import Stomp from "stompjs";
import { API_BASE_URL } from "../../config/api"
import UserFollowing from "../profile/UserFollowing"
import UserFollowers from "../profile/UserFollowers"
import PostPage from "../post_page/PostPage"
import Sidebar from "../../components/sidebar/Sidebar"

interface HomePageProps {
  auth: any;
};

const HomePage = ({ auth }: HomePageProps) => {
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


  return (
    // <div className="mx-10">
    <Grid container spacing={0} className="h-full">
      <Grid item xs={0} sx={{ display: { xs: 'none', md: 'block' } }} md={3}>
        <div className="sticky top-0">
          <Sidebar notReadNotificationCount={notReadNotificationCount}></Sidebar>
        </div>
      </Grid>

      <Grid item className="flex justify-center" xs={12} md={location.pathname === "/messages" ? 9 : 6}>
        <Routes>
          <Route path="" element={<MiddlePart />} />
          <Route path="videos" element={<VideoPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="notifications" element={<NotificationPage setNotReadNotificationCount={setNotReadNotificationCount} newNotification={newNotification} />} />
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
    </Grid>
    // </div>
  )
}

export default HomePage