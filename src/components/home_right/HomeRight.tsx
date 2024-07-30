import React from 'react'
import SearchUser from "./SearchUser"
import PopularUserCard from "./PopularUserCard";
import { Card } from "@mui/material";

const HomeRight = () => {
  const popularUser = [1, 1, 1, 1, 1, ];
  return (
    <div className="mt-4 space-y-4">
      <SearchUser></SearchUser>
      <Card className="p-2">
        <div className="flex justify-between items-center py-5">
          <p className="font-semibold opacity-70">Suggestions for you</p>
          <p className="text-xs font-semibold opacity-95">View all</p>
        </div>
        <div className="space-y-5">
          { popularUser.map((item) => <PopularUserCard></PopularUserCard>) }
        </div>
      </Card>
    </div>
  )
}

export default HomeRight