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
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { preProcessFile } from "typescript";
import User from "../../../utils/UserInterface";
import { Link, useNavigate } from "react-router-dom";
import formatDateFromString from "../../../utils/ConvertDate";

interface PostCardProps {
	postId: string;
	caption: string;
	createdAt: string;
	imageUrl: string | null;
	videoUrl: string | null;
	user: User;
	likedCount: number;
	commentCount: number;
	liked: boolean;
};

const stopDragging = (e: React.DragEvent) => {
	e.preventDefault();
};

const PostCard = ({ postId, caption, createdAt, imageUrl, videoUrl, user, likedCount, commentCount, liked }: PostCardProps) => {
	const [openComment, setOpenComment] = React.useState(false);
	const handleOpenComment = () => setOpenComment(true);
	const handleCloseComment = () => setOpenComment(false);

	// For update the liked and the comment count
	const [newLikedCount, setNewLikedCount] = React.useState(likedCount ? likedCount : 0);
	const [newCommentCount, setNewCommentCount] = React.useState(commentCount ? commentCount : 0);

	const [isLiked, setIsLiked] = React.useState(liked ? liked : false);

	const likePost = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		axios.put(`/api/posts/${postId}/like`, {}, {
			baseURL: API_BASE_URL,
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("jwt")}`,
			}
		}).then((response) => {
			if (response.data.result === "liked") {
				setIsLiked(true);
				setNewLikedCount((prev) => prev + 1);
			}
			else if (response.data.result === "unliked") {
				setIsLiked(false);
				setNewLikedCount((prev) => prev - 1);
			}
		}).catch((error) => {
			console.error(error);
		});
	}

	const navigate = useNavigate();
	const navigateToPostPage = () => {
		navigate(`/post/${postId}`);
	}

	return (
		<Card onClick={navigateToPostPage} className="flex p-2 cursor-pointer">
			<div>
				<Link to={`/profile/${user.userId}`}>
					<Avatar onDragStart={stopDragging} className="outline outline-2 outline-slate-300" sx={{ width: "2.5rem", height: "2.5rem", margin: "0.5rem" }} aria-label="recipe">
						{user.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
					</Avatar>
				</Link>
			</div>
			<div className="flex flex-col gap-y-2 w-full">
				<div className="space-x-2">
					<Link to={`/profile/${user.userId}`}>
						<span className="font-bold">{user.firstName} {user.lastName}</span>
					</Link>
					<span className="text-gray-500 text-sm">@{user.username}</span>
					<span>·</span>
					<span className="text-gray-500 text-sm">{formatDateFromString(createdAt)}</span>
				</div>
				<div className="min-h-12">
					<p className="whitespace-pre-line">{caption}</p>
				</div>
				{imageUrl ? <CardMedia
					className="cursor-pointer w-full rounded-md outline outline-1 outline-slate-300 z-10"
					component="img"
					image={imageUrl}
					onClick={(e) => e.stopPropagation()}
					alt="post image"
				/> : videoUrl && <video controls className="w-full rounded-md outline outline-1 outline-slate-300">
					<source src={videoUrl} type="video/mp4" />
					Your browser does not support the video tag.
				</video>}
				<div className="flex justify-between">
					<section className="flex gap-x-4">
						<div>
							<IconButton className="hover:text-red-400" onClick={likePost}>
								{isLiked ? <FavoriteIcon className="text-red-500" /> : <FavoriteIcon />}
							</IconButton>
							<span>{newLikedCount}</span>
						</div>
						<div>
							<IconButton className="hover:text-cyan-400" onClick={handleOpenComment}>
								<ChatBubbleIcon />
							</IconButton>
							<span>{newCommentCount}</span>
						</div>
					</section>
					<div>
						<IconButton className="hover:text-cyan-500">
							<ShareIcon />
						</IconButton>
					</div>
				</div>
			</div>
			{openComment && <CommentModal open={openComment} handleClose={handleCloseComment} postId={postId}
				likedCount={newLikedCount} commentCount={newCommentCount} setLikedCount={setNewLikedCount} setCommentCount={setNewCommentCount} />}
		</Card>
	)
}

export default PostCard