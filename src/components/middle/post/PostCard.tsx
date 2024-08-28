import { Avatar, Card, CardMedia, IconButton, Tooltip } from "@mui/material"
import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CommentModal from "./CommentModal";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { Link } from "react-router-dom";
import formatDateFromString from "../../../utils/ConvertDate";
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import Post from "../../../utils/PostInterface";
import UserLikedPostModal from "../user_liked/UserLikedPostModal";

interface PostCardProps {
	post: Post;
};

const stopDragging = (e: React.DragEvent) => {
	e.preventDefault();
};

const PostCard = ({ post }: PostCardProps) => {
	const [openComment, setOpenComment] = React.useState(false);
	const handleOpenComment = () => setOpenComment(true);
	const handleCloseComment = () => setOpenComment(false);

	// For update the liked and the comment count
	const [newLikedCount, setNewLikedCount] = React.useState(post.likedCount ? post.likedCount : 0);
	const [newCommentCount, setNewCommentCount] = React.useState(post.commentCount ? post.commentCount : 0);

	const [isLiked, setIsLiked] = React.useState(post.liked ? post.liked : false);

	// Open User Liked Modal
	const [openUserLiked, setOpenUserLiked] = React.useState(false);
	const handleOpenUserLiked = () => setOpenUserLiked(true);
	const handleCloseUserLiked = () => setOpenUserLiked(false);

	const likePost = () => {
		axios.put(`/api/posts/${post.postId}/like`, {}, {
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

	const [isSaved, setIsSaved] = React.useState(post.saved ? post.saved : false)

	const savePost = () => {
		axios.put(`/api/posts/${post.postId}/save`, {}, {
			baseURL: API_BASE_URL,
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("jwt")}`,
			}
		}).then((response) => {
			if (response.data.result === "saved") {
				setIsSaved(true);
			}
			else if (response.data.result === "unsaved") {
				setIsSaved(false);
			}
		}).catch((error) => {
			console.error(error);
		});
	}

	return (
		<Card className="flex p-2">
			<div>
				<Link to={`/profile/${post.user.userId}`}>
					<Avatar onDragStart={stopDragging} className="outline outline-2 outline-slate-300" sx={{ width: "2.5rem", height: "2.5rem", margin: "0.5rem" }} aria-label="recipe">
						{post.user.avatarUrl && <img src={post.user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
					</Avatar>
				</Link>
			</div>
			<div className="flex flex-col gap-y-2 w-full">
				<div className="space-x-2 w-full flex justify-between">
					<div className="space-x-2">
						<Link to={`/profile/${post.user.userId}`}>
							<span className="font-bold">{post.user.firstName} {post.user.lastName}</span>
						</Link>
						<span className="text-gray-500 text-sm">@{post.user.username}</span>
						<span>·</span>
						<span className="text-gray-500 text-sm">{formatDateFromString(post.createdAt)}</span>
					</div>
					<Link to={`/post/${post.postId}`}>
						<SubdirectoryArrowRightIcon className="hover:text-cyan-400" />
					</Link>
				</div>
				<div className="min-h-12">
					<p className="whitespace-pre-line">{post.caption}</p>
				</div>
				{post.imageUrl ? <CardMedia
					className="cursor-pointer w-full rounded-md outline outline-1 outline-slate-300 z-10"
					component="img"
					image={post.imageUrl}
					onClick={(e) => e.stopPropagation()}
					alt="post image"
				/> : post.videoUrl && <video controls className="w-full rounded-md outline outline-1 outline-slate-300">
					<source src={post.videoUrl} type="video/mp4" />
					Your browser does not support the video tag.
				</video>}
				<div className="flex justify-between">
					<section className="flex gap-x-4">
						<div>
							<IconButton className="hover:text-red-400" onClick={likePost}>
								{isLiked ? <FavoriteIcon className="text-red-500" /> : <FavoriteIcon />}
							</IconButton>
							<span onClick={handleOpenUserLiked} className="hover:underline hover:font-bold cursor-pointer">{newLikedCount}</span>
						</div>
						<div>
							<IconButton className="hover:text-cyan-400" onClick={handleOpenComment}>
								<ChatBubbleIcon />
							</IconButton>
							<span onClick={handleOpenComment} className="hover:underline hover:font-bold cursor-pointer">{newCommentCount}</span>
						</div>
					</section>
					<div>
						<Tooltip title={`${isSaved ? "Unsave this post" : "Save this post"}`}>
							<IconButton onClick={savePost}>
								{isSaved ? <BookmarkIcon className="text-cyan-500" /> : <BookmarkBorderIcon className="hover:text-cyan-500" />}
							</IconButton>
						</Tooltip>
						<IconButton className="hover:text-cyan-500">
							<ShareIcon />
						</IconButton>
					</div>
				</div>
			</div>
			{openComment && <CommentModal open={openComment} handleClose={handleCloseComment} postId={post.postId}
				likedCount={newLikedCount} commentCount={newCommentCount} setLikedCount={setNewLikedCount} setCommentCount={setNewCommentCount} />}
			{openUserLiked && <UserLikedPostModal postId={post.postId} open={openUserLiked} handleClose={handleCloseUserLiked} />}
		</Card>
	)
}

export default PostCard