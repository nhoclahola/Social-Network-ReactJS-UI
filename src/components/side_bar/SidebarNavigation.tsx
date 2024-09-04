import HomeIcon from '@mui/icons-material/Home';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';

export interface NavigationItem {
    title: string;
    icon: React.ReactNode;
    path: string;
}

export const navigationMenu: NavigationItem[] = [
    {
        title: "Home",
        icon: <HomeIcon />,
        path: "/",
    },
    {
        title: "Videos",
        icon: <VideoLibraryIcon />,
        path: "/videos",
    },
    {
        title: "Search",
        icon: <SearchIcon />,
        path: "/search",
    },
    {
        title: "Notifications",
        icon: <NotificationsIcon />,
        path: "/notifications",
    },
    {
        title: "Messages",
        icon: <MessageIcon />,
        path: "/messages",
    },
    {
        title: "Communities",
        icon: <GroupIcon />,
        path: "/communities",
    },
    {
        title: "Profile",
        icon: <AccountCircleIcon />,
        path: "/profile",
    },
]