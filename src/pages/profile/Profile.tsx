import { Avatar, Box, Button, Card, Tab, Tabs } from "@mui/material";
import React from 'react'
import { Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import ProfilePosts from "./ProfilePosts";
import ProfileVideos from "./ProfileVideos";
import ProfileSavedPosts from "./ProfileSavedPosts";
import ProfileReposts from "./ProfileReposts";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const tabs = [
  { value: "posts", name: "Posts" },
  { value: "videos", name: "Videos" },
  { value: "saved", name: "Saved" },
  { value: "reposts", name: "Reposts" }
]

const Profile = () => {
  const { auth } = useSelector((store: RootState) => store);
  const pathname = useLocation().pathname;
  const segments = pathname.split('/').filter((segment: string) => segment.length > 0);
  let lastSegment = segments.length > 0 ? segments[segments.length - 1] : "posts";
  
  // In case we go to there from profile/:id
  if (!tabs.some(tab => tab.value === lastSegment))
    lastSegment = "posts";   // Default tab

  const { id } = useParams();
  const [value, setValue] = React.useState(lastSegment);
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(`${newValue}`, { replace: true });
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <Card className="pb-10 w-[80%]">
      <div className="h-[15rem]">
        <img
          className="w-full h-full rounded-md"
          src="https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png" alt=""></img>
      </div>
      <div className="px-5 flex justify-between items-start mt-5 h-[4rem]">
        <Avatar className="transform -translate-y-24" sx={{ width: "10rem", height: "10rem" }}></Avatar>
        {true ? <Button onClick={handleOpen} sx={{ borderRadius: "40px" }} variant="outlined">Edit Profile</Button> : <Button sx={{ borderRadius: "40px" }} variant="outlined">Follow</Button>}
      </div>
      <section className="p-5">
        <div>
          <h1 className="py-1 font-bold text-xl">{auth.user?.firstName + " " + auth.user?.lastName}</h1>
          <p>@{auth.user?.firstName.toLowerCase() + "_" + auth.user?.lastName.toLowerCase()}</p>
        </div>
        <div className="flex gap-2 items-center py-3">
          <span>41 post</span>
          <span>35 followers</span>
          <span>5 followings</span>
        </div>
        <div>
          <p>This is my website hahaahahaha.</p>
        </div>
      </section>
      <section>
        <Box sx={{ width: '100%', borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="wrapped label tabs example"
          >
            {tabs.map((item) => <Tab value={item.value} label={item.name} />)}
          </Tabs>
        </Box>
        <div className="flex justify-center mt-5">
          {/* {value === "post" && <ProfilePosts></ProfilePosts>}
          {value === "video" && <ProfileVideos></ProfileVideos>}
          {value === "saved" && <ProfileSavedPosts></ProfileSavedPosts>}
          {value === "repost" && <ProfileReposts></ProfileReposts>} */}
          <Outlet />
        </div>
      </section>

      <section>
        <EditProfileModal open={open} handleClose={handleClose}></EditProfileModal>
      </section>
    </Card>
  )
}

export default Profile