import { Avatar } from "@mui/material"
import React from 'react'
import User from "../../utils/UserInterface"
import { Link } from "react-router-dom"
import truncateUsername from "../../utils/TruncateName"

interface LastestActivityFollowingsProps {
	user: User
};

const LatestActivityFollowings = ({user}: LastestActivityFollowingsProps) => {
	return (
		<Link to={`/profile/${user.userId}`} className="flex flex-col items-center">
			<Avatar className="outline outline-2 outline-slate-300" sx={{ width: "4rem", height: "4rem" }}>
				{user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
			</Avatar>
			<p>@{truncateUsername(user?.username, 5)}</p>
		</Link>
	)
}

export default LatestActivityFollowings