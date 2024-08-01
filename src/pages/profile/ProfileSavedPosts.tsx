import React from 'react'
import PostCard from "../../components/middle/post/PostCard";

const ProfileSavedPosts = React.memo(() => {
  const savedPosts = [1, 1, 1, 1, 1];
  return (
    <div className="space-y-5 w-[100%]">
      {/* {savedPosts.map((item) => <div className="border border-slate-100 rounded-md"><PostCard/></div>)} */}
    </div>
  )
})

export default ProfileSavedPosts