import HomeIcon from '@mui/icons-material/Home';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface NavigationItem {
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
        title: "Reels",
        icon: <VideoLibraryIcon/>,
        path: "/",
    },
    {
        title: "Create Reels",
        icon: <QueuePlayNextIcon/>,
        path: "/",
    },
    {
        title: "Notifications",
        icon: <NotificationsIcon/>,
        path: "/",
    },
    {
        title: "Message",
        icon: <MessageIcon/>,
        path: "/",
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
        path: "/",
    },
]