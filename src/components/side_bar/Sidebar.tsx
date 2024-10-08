import React, { useContext } from 'react'
import { NavigationItem, navigationMenu } from "./SidebarNavigation"
import { Avatar, Button, Card, Divider, IconButton, Menu, MenuItem, useTheme } from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../App";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import roundingNumber from "../../utils/RoundingNumber";
import truncateUsername from "../../utils/TruncateName";

interface SidebarProps {
  notReadNotificationCount: number;
}

const Sidebar = ({ notReadNotificationCount }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const setThemeName = useContext(ThemeContext);
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
    if (item.title === "Profile") {
      if (location.pathname.includes(`${item.path}/${auth.user.userId}`))
        return;
      navigate(`/profile/${auth.user?.userId}`, { replace: true });
    }
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
    localStorage.setItem("isLoggedOut", Date.now().toString());
    window.location.reload();
  };

  const changeTheme = () => {
    if (localStorage.getItem("theme") === "dark") {
      localStorage.setItem("theme", "light");
      setThemeName("light");
    }
    else {
      localStorage.setItem("theme", "dark");
      setThemeName("dark");
    }
  }

  const formattedNotReadingNotificationCount = React.useMemo(() => roundingNumber(notReadNotificationCount), [notReadNotificationCount])
  const formattedName = React.useMemo(() => truncateUsername(auth.user?.firstName + " " + auth.user?.lastName, 14), []);
  const formattedUsername = React.useMemo(() => truncateUsername(auth.user?.username, 10), []);

  return (
    <Card className="h-screen flex flex-col justify-between py-5">
      <div className="space-y-4 mx-2">
        <Link to="/">
          <div className="flex justify-center items-center">
            <img alt="Y" src="/favicon.ico" className="w-[10%] h-[10%]"></img>
            <span className="font-bold text-xl ml-2">Y SOCIAL MEDIA</span>
          </div>
        </Link>
        <div className="space-y-2">
          {
            navigationMenu.map((item, index) => {
              return (
                <div key={index} onClick={() => handleNavigate(item)} className={`flex items-center cursor-pointer space-x-3 ${location.pathname !== item.path && "hover:bg-slate-300"} py-4 px-2 rounded-xl ${(location.pathname === item.path || location.pathname.includes(`${item.path}/${auth.user.userId}`)) && "bg-cyan-500"}`}>
                  {item.icon}
                  <p className="text-xl">{item.title}</p>
                  {(item.title === "Notifications" && notReadNotificationCount > 0) && <div className="bg-red-600 rounded-full flex justify-center items-center px-1"><span className="text-sm text-white">{formattedNotReadingNotificationCount}</span></div>}
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
              <h1 className="font-bold">{formattedName}</h1>
              <p className="opacity-70">@{formattedUsername}</p>
            </div>
          </div>
          <div>
            <IconButton onClick={changeTheme}>
              {theme.palette.mode === "dark" ? <Brightness4Icon /> : <Brightness5Icon />}
            </IconButton>
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
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default Sidebar