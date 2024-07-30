import { Avatar } from "@mui/material"
import React from 'react'

const StoryCircle = () => {
	return (
		<div className="flex flex-col items-center cursor-pointer">
			<Avatar sx={{ width: "4rem", height: "4rem" }}></Avatar>
			<p>Name</p>
		</div>
	)
}

export default StoryCircle