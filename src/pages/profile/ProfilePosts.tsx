import React from 'react'
import PostCard from "../../components/middle/post/PostCard"

const ProfilePosts = React.memo(() => {
  const post = [1, 1, 1, 1];
  return (
    <div className="space-y-5 w-[100%]">
      {/* {post.map((item) => <div className="border border-slate-100 rounded-md"><PostCard/></div>)} */}
    </div>
  )
})

export default ProfilePosts