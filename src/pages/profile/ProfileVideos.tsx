import React from 'react'
import UserVideo from "../../components/video/UserVideo";

const ProfileVideos = React.memo(() => {
  const videos = [1, 1, 1, 1, 1];
  return (
    <div className="flex flex-wrap gap-y-2">
      {videos.map((video) => <UserVideo></UserVideo>)}
    </div>
  )
})

export default ProfileVideos