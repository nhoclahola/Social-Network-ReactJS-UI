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
import CommentModal from "./CommentModal";

interface User {
	email: string;
	firstName: string;
	lastName: string;
};

interface PostCardProps {
	postId: string;
	caption: string;
	createdAt: string;
	imageUrl: string;
	user: User;
	likedCount: number;
	commentCount: number;
};

const PostCard = ({ postId, caption, createdAt, imageUrl, user, likedCount, commentCount }: PostCardProps) => {
	const [openComment, setOpenComment] = React.useState(false);
	const handleOpenComment = () => setOpenComment(true);
	const handleCloseComment = () => setOpenComment(false);
	
	return (
		<Card className="flex p-2">
			<Avatar sx={{ width: "2.5rem", height: "2.5rem", bgcolor: red[500], margin: "0.5rem" }} aria-label="recipe">
				R
			</Avatar>
			<div className="flex flex-col gap-y-2 w-full">
				<div className="space-x-2">
					<span className="font-bold">{user.firstName} {user.lastName}</span>
					<span className="text-gray-500 text-sm">-{user.email}</span>
					<span>·</span>
					<span className="text-gray-500 text-sm">{createdAt}</span>
				</div>
				<div className="min-h-12">
					<p className="whitespace-pre-line">{caption}</p>
				</div>
				{imageUrl && <CardMedia
					className="cursor-pointer w-full rounded-md outline outline-1 outline-slate-300"
					component="img"
					image={imageUrl}
					alt="Paella dish"
				/>}
				<div className="flex justify-between">
					<section className="flex gap-x-4">
						<div>
							<IconButton className="hover:text-red-400">
								<FavoriteIcon/>
							</IconButton>
							<span>{likedCount ? likedCount : 0}</span>
						</div>
						<div>
							<IconButton className="hover:text-cyan-400" onClick={handleOpenComment}>
								<ChatBubbleIcon/>
							</IconButton>
							<span>{commentCount ? commentCount : 0}</span>
						</div>
					</section>
					<div>
						<IconButton className="hover:text-cyan-500">
							<ShareIcon/>
						</IconButton>
					</div>
				</div>
			</div>
			{openComment && <CommentModal open={openComment} handleClose={handleCloseComment} postId={postId}/>}
		</Card>
	)
}

export default PostCard