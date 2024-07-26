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

const PostCard = () => {
	const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
	return (
		<Card>
			<CardHeader
				avatar={
					<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
						R
					</Avatar>
				}
				action={
					<IconButton aria-label="settings">
						<MoreVertIcon />
					</IconButton>
				}
				title="Username"
				subheader="September 14, 2016"
			/>
			<CardContent sx={{ paddingTop: "4px" }}>
				<Typography variant="body2" color="text.secondary">
					This impressive paella is a perfect party dish and a fun meal to cook
					together with your guests. Add 1 cup of frozen peas along with the mussels,
					if you like.
				</Typography>
			</CardContent>
			<CardMedia
				component="img"
				height="194"
				image="/img.png"
				alt="Paella dish"
			/>
			<CardActions className="flex justify-between" disableSpacing>
				<div>
					<IconButton>
						{ true ? <FavoriteIcon/> : <FavoriteBorderIcon/> }
					</IconButton>
					<IconButton>
						<ShareIcon></ShareIcon>
					</IconButton>
					<IconButton>
						<ChatBubbleIcon></ChatBubbleIcon>
					</IconButton>
				</div>
				<IconButton>
						{ true ? <BookmarkIcon/> : <BookmarkBorderIcon/> }
					</IconButton>
			</CardActions>
		</Card>
	)
}

export default PostCard