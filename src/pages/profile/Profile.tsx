import { Avatar, Box, Button, Card, Tab, Tabs } from "@mui/material";
import React from 'react'
import { Link, Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import ProfilePosts from "./ProfilePosts";
import ProfileVideos from "./ProfileVideos";
import ProfileSavedPosts from "./ProfileSavedPosts";
import ProfileReposts from "./ProfileReposts";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import Loading from "./Loading";
import UserWithData from "../../utils/UserWithData";

const tabs = [
  { value: "posts", name: "Posts" },
  { value: "videos", name: "Videos" },
  { value: "saved", name: "Saved" },
  { value: "reposts", name: "Reposts" }
]

const stopDragging = (e: React.DragEvent) => {
  e.preventDefault();
};

const Profile = () => {
  const auth = useSelector((store: RootState) => store.auth);
  // Get userId from the URL param (profile/:id)
  const { userId } = useParams();
  const [user, setUser] = React.useState<UserWithData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

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

  return (
    <div className="pb-10 w-full px-5">
      <div onDragStart={stopDragging}  className="h-[15rem] bg-slate-400 cursor-pointer">
        {user?.coverPhotoUrl && <img alt="cover" className="w-full h-full rounded-md" src={user?.coverPhotoUrl}></img>}
      </div>
      <div className="px-5 flex justify-between items-start mt-5 h-[4rem]">
        <Avatar onDragStart={stopDragging} className="transform -translate-y-24 outline outline-4 outline-slate-300 cursor-pointer" sx={{ width: "10rem", height: "10rem" }}>
          {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
        </Avatar>
        {auth?.user?.userId === userId ? <Button onClick={handleOpen} sx={{ borderRadius: "40px" }} variant="outlined">Edit Profile</Button> : <Button onClick={followUser} sx={{ borderRadius: "40px" }} variant="outlined">{isFollow ? "Unfollow" : "Follow"}</Button>}
      </div>
      {user &&
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
              <Route path="posts" element={<ProfilePosts userId={userId} />} />
              <Route path="videos" element={<ProfileVideos userId={userId} />} />
              <Route path="saved" element={<ProfileSavedPosts />} />
              <Route path="reposts" element={<ProfileReposts />} />
              <Route index path="*" element={<Navigate to="posts" replace />} />
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