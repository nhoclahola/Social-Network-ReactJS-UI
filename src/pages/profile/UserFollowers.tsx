import axios from "axios";
import React from 'react'
import { API_BASE_URL } from "../../config/api";
import { Link, useParams } from "react-router-dom";
import User from "../../utils/UserInterface";
import { Avatar, Divider } from "@mui/material";

const UserFollowers = () => {
  const { userId } = useParams();
  const [user, setUser] = React.useState<User | null>(null); 
  const [users, setUsers] = React.useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = React.useState(true);
  const [errorUsers, setErrorUsers] = React.useState(null);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    axios.get(`/api/users/${userId}`, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then(response => {
      setUser(response.data.result);
    }).catch(error => {
      console.error(error);
    });
  }, []);

  React.useEffect(() => {
    setLoadingUsers(true);
    axios.get(`/api/users/followers/${userId}`, {
      params: {
        index: index,
      },
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then(response => {
      setUsers((prev) => {
        const newUsers = response.data.result.filter(
          (newUser: User) => !prev.some((prevUser) => prevUser.userId === newUser.userId)
        );
        return [...prev, ...newUsers];
      })
      setLoadingUsers(false);
    }).catch(error => {
      setErrorUsers(error);
      setLoadingUsers(false);
    });
  }, [index]);

  return (
    <div className="w-full m-5 space-y-5">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2">
          <Avatar sx={{ width: "3rem", height: "3rem" }}>
            {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
          </Avatar>
          <div>
            <h1 className="font-bold font-mono text-xl">{user?.firstName + " " + user?.lastName}</h1>
            <p>@{user?.username}</p>
          </div>
        </div>
        <div>
          <h1 className="font-bold font-serif">Followers</h1>
        </div>
      </div>
      <Divider />
      <div className="flex flex-col gap-y-4">
        {users.map((user, index) =>
        <Link to={`/profile/${user.userId}`}>
          <div className="flex gap-x-2 shadow p-2 bg-white hover:bg-transparent">
            <Avatar>
              {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
            </Avatar>
            <div>
              <h1 className="font-bold">{user.firstName + " " + user.lastName}</h1>
              <p>@{user.username}</p>
              <p>{user?.description}</p>
            </div>
          </div>
          </Link>
        )}
      </div>
    </div>
  )
  
}

export default UserFollowers