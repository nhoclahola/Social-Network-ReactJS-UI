import { Avatar, Box, Button, Card, CircularProgress, IconButton, Tab, Tabs, useTheme } from "@mui/material";
import React from 'react'
import { Link, Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import ProfilePosts from "./ProfilePosts";
import ProfileVideos from "./ProfileVideos";
import ProfileSavedPosts from "./ProfileSavedPosts";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import Loading from "./Loading";
import UserWithData from "../../utils/UserWithData";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ImageIcon from '@mui/icons-material/Image';

const tabs = [
  { value: "posts", name: "Posts" },
  { value: "videos", name: "Videos" },
  { value: "saved", name: "Saved" },
]

const stopDragging = (e: React.DragEvent) => {
  e.preventDefault();
};

const Profile = () => {
  const auth = useSelector((store: RootState) => store.auth);
  const theme = useTheme();
  // Get userId from the URL param (profile/:id)
  const { userId } = useParams();
  const [user, setUser] = React.useState<UserWithData | null>(null);
  const [loading, setLoading] = React.useState(true);

  const pathname = useLocation().pathname;
  const segments = pathname.split('/').filter((segment: string) => segment.length > 0);
  let lastSegment = segments.length > 0 ? segments[segments.length - 1] : "posts";

  // In case we go to there from profile/:id
  if (!tabs.some(tab => tab.value === lastSegment))
    lastSegment = "posts";   // Default tab

  const [value, setValue] = React.useState(lastSegment);
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(`${newValue}`, { replace: true });
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [isFollow, setIsFollow] = React.useState<boolean>(false);
  const [followerCount, setFollowerCount] = React.useState<number>(0);

  // Get user information
  React.useEffect(() => {
    setLoading(true);
    axios.get(`/api/users/${userId}`, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then(response => {
      setUser(response.data.result);
      console.log(user);
      setIsFollow(response.data.result.follow);
      setFollowerCount(response.data.result.followers);
      setLoading(false);
    }).catch(error => {
      console.error(error);
      setLoading(false);
    })
  }, [userId])

  //                            Change avatar, cover photo function
  const [avatar, setAvatar] = React.useState<File | null>(null);
  const [loadingAvatar, setLoadingAvatar] = React.useState(false);
  const [cover, setCover] = React.useState<File | null>(null);
  const [loadingCover, setLoadingCover] = React.useState(false);
  const [avatarObjectUrl, setAvatarObjectUrl] = React.useState<string | undefined>(undefined);
  const [coverObjectUrl, setCoverObjectUrl] = React.useState<string | undefined>(undefined);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCover(event.target.files[0]);
    }
  };

  // Clean up if image change
  React.useEffect(() => {
    let objectUrl: string | null = null;
    if (avatar) {
      objectUrl = URL.createObjectURL(avatar);
      setAvatarObjectUrl(objectUrl);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        console.log("revoked avatar url", objectUrl);
      }
    };
  }, [avatar]);

  React.useEffect(() => {
    let objectUrl: string | null = null;
    if (cover) {
      objectUrl = URL.createObjectURL(cover);
      setCoverObjectUrl(objectUrl);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        console.log("revoked cover url", objectUrl);
      }
    };
  }, [cover]);

  React.useEffect(() => {
    setAvatar(null);
    setCover(null);
    setAvatarObjectUrl(undefined);
    setCoverObjectUrl(undefined);
  }, [user]);

  const uploadAvatar = async (image: File | null) => {
    setLoadingAvatar(true);
    const formData = new FormData();
    // If avatar is null, append an empty file to prevent error
    const emptyFile = new File([], '');
    formData.append('image', image || emptyFile);
    axios.post(`${API_BASE_URL}/api/users/avatar`, formData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "multipart/form-data"
      }
    }).then((response) => {
      window.location.reload();
    }).catch((error) => {
      setLoadingAvatar(false);
      setAvatar(null);
      console.error("error", error);
    });
  };

  const uploadCover = async (image: File | null) => {
    setLoadingCover(true);
    const formData = new FormData();
    // If cover is null, append an empty file to prevent error
    const emptyFile = new File([], '');
    formData.append('image', image || emptyFile);
    axios.post(`${API_BASE_URL}/api/users/cover`, formData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "multipart/form-data"
      }
    }).then((response) => {
      window.location.reload();
    }).catch((error) => {
      setLoadingCover(false);
      setCover(null);
      console.error("error", error);
    });
  };

  if (loading)
    return (
      <Loading />
    )

  const followUser = () => {
    axios.post(`/api/users/follow/${userId}`, {}, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then(response => {
      if (response.data.result === "followed") {
        setIsFollow(true);
        setFollowerCount((prev) => prev + 1);
      }
      else if (response.data.result === "unfollowed") {
        setIsFollow(false);
        setFollowerCount((prev) => prev - 1);
      }
    }).catch((error) => {
      console.error("error", error);
    })
  }

  const cancelSaveAvatar = () => {
    setAvatar(null);
  }

  const cancelSaveCover = () => {
    setCover(null);
  }

  return (
    <div className="relative pb-10 w-full px-5">
      {
        cover &&
        <div className="flex justify-end">
          <div className="absolute top-2 z-10 space-x-4">
            <button onClick={cancelSaveCover} style={{ backgroundColor: theme.palette.background.paper }} className="hover:text-red-500 rounded-md w-20">
              <span className="p-2">Cancel</span>
            </button>
            <button onClick={() => uploadCover(cover)} style={{ backgroundColor: theme.palette.background.paper }} className="hover:text-cyan-500 rounded-md w-20">
              <span className="p-2">Save</span>
            </button>
          </div>
        </div>
      }
      <div style={{ backgroundColor: theme.palette.background.paper }}>
        <div className="relative">
          <div className="relative">
            <input className="hidden" placeholder="image" id="cover-input" type="file" accept="image/*" onChange={handleCoverChange} ></input>
            <div onDragStart={stopDragging} className="h-[15rem] bg-slate-400 cursor-pointer">
              {cover ? <img src={coverObjectUrl} alt="cover" className="w-full h-full" /> : user?.coverPhotoUrl && <img alt="cover" className="w-full h-full rounded-md" src={user?.coverPhotoUrl}></img>}
            </div>
            {
              auth?.user?.userId === userId &&
              <label className="cursor-pointer" htmlFor="cover-input">
                <div style={{ backgroundColor: theme.palette.background.paper }} className="absolute right-2 bottom-4 px-2 py-1 rounded-lg flex items-center hover:text-cyan-600">
                  <ImageIcon />
                  <span>Change cover</span>
                </div>
              </label>
            }
            {
              loadingCover &&
              <div className="absolute top-1/2 left-1/2">
                <CircularProgress />
              </div>
            }
          </div>
          <div className="px-5 flex justify-between items-start mt-5 h-[4rem]">
            <input className="hidden" placeholder="image" id="avatar-input" type="file" accept="image/*" onChange={handleAvatarChange} ></input>
            <div className="absolute bottom-[-0.5rem]">
              <Avatar onDragStart={stopDragging} className="outline outline-4 outline-slate-300 cursor-pointer" sx={{ width: "10rem", height: "10rem" }}>
                {avatar ? <img src={avatarObjectUrl} alt="avatar" className="h-full w-auto object-cover" /> : user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
              </Avatar>
              {
                loadingAvatar &&
                <div className="absolute top-1/3 left-[40%]">
                  <CircularProgress />
                </div>
              }
              {
                auth?.user?.userId === userId &&
                <label className="absolute left-28 bottom-0" htmlFor="avatar-input">
                  <IconButton sx={{ bgcolor: "#beccc2" }} className="hover:text-cyan-500" component="span" >
                    <CameraAltIcon></CameraAltIcon>
                  </IconButton>
                </label>
              }
            </div>
            <div className="flex w-full justify-end gap-x-10">
              {
                avatar &&
                <div className="space-x-4">
                  <Button onClick={cancelSaveAvatar}
                    sx={{
                      borderRadius: "40px",
                      borderColor: "red",
                      color: "red",
                      '&:hover': {
                        borderColor: "firebrick ",
                        color: "firebrick ",
                      },
                    }}
                    variant="outlined">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => uploadAvatar(avatar)}
                    variant="outlined"
                    sx={{
                      borderRadius: "40px",
                      borderColor: "limegreen", 
                      color: "limegreen",  
                      '&:hover': {
                        borderColor: "mediumseagreen", 
                        color: "mediumseagreen", 
                      },
                    }}
                  >
                    Save Avatar
                  </Button>
                </div>
              }
              {auth?.user?.userId === userId ? <Button onClick={handleOpen} sx={{ borderRadius: "40px" }} variant="outlined">Edit Profile</Button> : <Button onClick={followUser} sx={{ borderRadius: "40px" }} variant="outlined">{isFollow ? "Unfollow" : "Follow"}</Button>}
            </div>
          </div>
        </div>
        {
          user &&
          <section className="p-5">
            <div>
              <h1 className="py-1 font-bold text-xl">{user?.firstName + " " + user?.lastName}</h1>
              <p>@{user?.username}</p>
            </div>
            <div className="flex gap-2 items-center py-3">
              <span>{user?.posts} Posts</span>
              <Link to={`/profile/${user.userId}/followers`}>
                <span className="font-bold hover:underline">{followerCount} Followers</span>
              </Link>
              <Link to={`/profile/${user.userId}/following`}>
                <span className="font-bold hover:underline">{user?.followings} Followings</span>
              </Link>
            </div>
            <div>
              <p>{user?.description}</p>
            </div>
          </section>
        }
      </div>
      {user ?
        <section>
          <Box sx={{ width: '100%', borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="wrapped label tabs example"
            >
              {tabs.map((item) => <Tab key={item.name} value={item.value} label={item.name} />)}
            </Tabs>
          </Box>
          <div className="flex justify-center mt-5">
            {/* {value === "post" && <ProfilePosts></ProfilePosts>}
          {value === "video" && <ProfileVideos></ProfileVideos>}
          {value === "saved" && <ProfileSavedPosts></ProfileSavedPosts>}
          {value === "repost" && <ProfileReposts></ProfileReposts>} */}
            {/* <Outlet /> */}
            <Routes>
              <Route path="" element={<ProfilePosts userId={userId} />} />
              <Route path="videos" element={<ProfileVideos userId={userId} />} />
              <Route path="saved" element={<ProfileSavedPosts userId={userId} />} />
              <Route index path="*" element={<Navigate to="" replace />} />
            </Routes>
          </div>
        </section>
        :
        <section className="h-2/4 flex flex-col justify-center items-center">
          <h1 className="font-bold text-xl">This account doesn't exist</h1>
          <h3 className="font-semibold">Try finding another account.</h3>
        </section>
      }

      {auth?.user?.userId === userId && <section>
        <EditProfileModal open={open} handleClose={handleClose} setUser={setUser}></EditProfileModal>
      </section>}
    </div>
  )
}

export default Profile