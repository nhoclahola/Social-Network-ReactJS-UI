import React from 'react'
import { NavigationItem, navigationMenu } from "./SidebarNavigation"
import { Avatar, Button, Card, Divider, Menu, MenuItem } from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { replace } from "formik";
import Stomp from "stompjs";
import { useAppSelector } from "../../redux/hook";
import NotificationInterface from "../../utils/NotificationInterface";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

interface SidebarProps {
  notReadNotificationCount: number;
}

const Sidebar = ({notReadNotificationCount}: SidebarProps) => {
  const stompClient = useAppSelector((store) => store.stompClient.data);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((store: RootState) => store.auth)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (item: NavigationItem) => {
    if (item.title === "Profile")
      navigate(`/profile/${auth.user?.userId}`, { replace: true });
    else if (item.title === "Search") {
      if (!!location.search && location.pathname === "/search")
        navigate(item.path + location.search, { replace: true });
      else
        navigate(item.path, { replace: true });
    }
    else
      navigate(item.path, { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.reload();
  };

  const sendMessageToServer = (message: string) => {
    if (stompClient && stompClient.connected) {
      stompClient.send(`/app/notification/${auth?.user.userId}`, {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      }, message);
    }
  }

  return (
    <Card className="h-screen flex flex-col justify-between py-5">
      <div className="space-y-4 mx-2">
        <div className="text-center">
          <Link to="/">
            <span className="font-bold text-xl ml-2">Y.COM</span>
          </Link>
        </div>
        <div className="">
          {
            navigationMenu.map((item) => {
              return (
                <div onClick={() => handleNavigate(item)} className="flex items-center cursor-pointer space-x-3 hover:bg-slate-300 py-4 px-2 rounded-xl">
                  {item.icon}
                  <p className="text-xl">{item.title}</p>
                  {(item.title === "Notifications" && notReadNotificationCount > 0) && <div className="w-4 h-4 bg-red-600 rounded-full flex justify-center items-center "><span className="text-sm text-white">{notReadNotificationCount}</span></div> }
                </div>
              )
            })
          }
        </div>
      </div>
      <div>
        <Divider></Divider>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center space-x-3 pl-5">
            <Avatar>
              {auth.user?.avatarUrl && <img src={auth.user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
            </Avatar>
            <div>
              <h1 onClick={() => sendMessageToServer("send message")}  className="font-bold">{auth.user?.firstName + " " + auth.user?.lastName}</h1>
              <p className="opacity-70">@{auth.user?.username}</p>
            </div>
          </div>
          <div>
            <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            >
              <MoreVertIcon></MoreVertIcon>
            </Button>
            <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default Sidebar