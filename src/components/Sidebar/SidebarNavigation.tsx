import HomeIcon from '@mui/icons-material/Home';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export interface NavigationItem {
    title: string;
    icon: React.ReactNode;
    path: string;
}

export const navigationMenu: NavigationItem[] = [
    {
        title: "Home",
        icon: <HomeIcon/>,
        path: "/",
    },
    {
        title: "Videos",
        icon: <VideoLibraryIcon/>,
        path: "/videos",
    },
    {
        title: "Create Video",
        icon: <QueuePlayNextIcon/>,
        path: "/create-video",
    },
    {
        title: "Notifications",
        icon: <NotificationsIcon/>,
        path: "/",
    },
    {
        title: "Messages",
        icon: <MessageIcon/>,
        path: "/messages",
    },
    {
        title: "List",
        icon: <ListAltIcon/>,
        path: "/",
    },
    {
        title: "Communities",
        icon: <GroupIcon/>,
        path: "/",
    },
    {
        title: "Profile",
        icon: <AccountCircleIcon/>,
        path: "/profile",
    },
]