import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography } from "@mui/material"
import { red } from "@mui/material/colors"
import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ExpandMore } from "@mui/icons-material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

interface User {
	email: string;
	firstName: string;
	lastName: string;
};

interface PostCardProps {
	caption: string;
	createdAt: string;
	imageUrl: string;
	user: User;
};

const PostCard = ({ caption, createdAt, imageUrl, user }: PostCardProps) => {
	const [expanded, setExpanded] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};
	return (
		<Card>
			<CardHeader
				avatar={
					<Avatar sx={{ width: "3rem", height: "3rem", bgcolor: red[500] }} aria-label="recipe">
						R
					</Avatar>
				}
				action={
					<IconButton aria-label="settings">
						<MoreVertIcon />
					</IconButton>
				}
				title={user.firstName + " " + user.lastName}
				subheader={createdAt}
			/>
			<CardContent sx={{ paddingTop: "4px" }}>
				<Typography variant="body2" color="text.secondary">
					{caption}
				</Typography>
			</CardContent>
			{imageUrl && <CardMedia
				className="cursor-pointer"
				component="img"
				image={imageUrl}
				alt="Paella dish"
			/>}
			<CardActions className="flex justify-between" disableSpacing>
				<div>
					<IconButton>
						{true ? <FavoriteIcon /> : <FavoriteBorderIcon />}
					</IconButton>
					<IconButton>
						<ShareIcon></ShareIcon>
					</IconButton>
					<IconButton>
						<ChatBubbleIcon></ChatBubbleIcon>
					</IconButton>
				</div>
				<IconButton>
					{true ? <BookmarkIcon /> : <BookmarkBorderIcon />}
				</IconButton>
			</CardActions>
		</Card>
	)
}

export default PostCard