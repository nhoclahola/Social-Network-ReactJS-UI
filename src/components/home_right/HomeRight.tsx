import React from 'react'
import SearchUser from "./SearchUser"
import PopularUserCard from "./PopularUserCard";
import { Card } from "@mui/material";
import User from "../../utils/UserInterface";
import { API_BASE_URL } from "../../config/api";
import axios from "axios";
import LoadingPost from "../middle/loading_post/LoadingPost";

const HomeRight = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`/api/users/popular`, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then((response) => {
      setUsers(response.data.result);
      setLoading(false);
    }).catch((error) => {
      setError(error);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mt-4 space-y-4">
      <SearchUser></SearchUser>
      <Card className="p-2">
        <div className="flex justify-between items-center py-5">
          <p className="font-semibold opacity-70">Suggestions for you</p>
          <p className="text-xs font-semibold opacity-95">View all</p>
        </div>
        <div className="space-y-5">
          {loading ? <LoadingPost /> : users.map((item) => <PopularUserCard key={item.userId} avatarUrl={item.avatarUrl}
            coverPhotoUrl={item.coverPhotoUrl} email={item.email} firstName={item.firstName}
            lastName={item.lastName} gender={item.gender} username={item.username} userId={item.userId} ></PopularUserCard>)}
        </div>
      </Card>
    </div>
  )
}

export default HomeRight