import { Avatar, useTheme } from "@mui/material"
import React from 'react'
import formatDateFromString from "../../../utils/ConvertDate";
import User from "../../../utils/UserInterface";
import { Link } from "react-router-dom";
import CommentInterface from "../../../utils/CommentInterface";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

export interface CommentProps {
  comment: CommentInterface;
};

const Comment = ({ comment }: CommentProps) => {
  const theme = useTheme()
  const [likedCount, setLikedCount] = React.useState(comment.likedCount ? comment.likedCount : 0);
  const [isLiked, setIsLiked] = React.useState(comment.liked ? comment.liked : false);

  const likeComment = () => {
    axios.put(`/api/comments/like/${comment.commentId}`, {}, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      },
    }).then((response) => {
      if (response.data.result === "liked") {
        setIsLiked(true);
        setLikedCount((prev) => prev + 1);
      }
      else if (response.data.result === "unliked") {
        setIsLiked(false);
        setLikedCount((prev) => prev - 1);
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  return (
    <div className="flex flex-row gap-x-4">
      <Link to={`/profile/${comment.user.userId}`}>
        <Avatar className="cursor-pointer" sx={{ width: "2rem", height: "2rem" }} >
          {comment.user.avatarUrl && <img src={comment.user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
        </Avatar>
      </Link>
      <div>
        <div style={{background: theme.palette.background.default}} className="w-full rounded-xl border px-4 py-2 ">
          <Link to={`/profile/${comment.user.userId}`}>
            <h3 className="font-semibold text-sm">{comment.user.firstName} {comment.user.lastName}</h3>
          </Link>
          <p className="whitespace-pre-line">{comment.content}</p>
        </div>
        <div className="flex gap-x-4 items-center">
          {/* <h5 className="text-sm text-cyan-500 cursor-pointer ml-2">Like</h5> */}
          <div className="space-x-1">
            {isLiked ? <ThumbUpAltIcon onClick={likeComment} fontSize="small" className="cursor-pointer text-cyan-500" /> : <ThumbUpAltIcon onClick={likeComment} fontSize="small" className="cursor-pointer hover:text-cyan-500" />}
            <span className="text-xs tracking-tighter">{likedCount}</span>
          </div>
          <span className="text-xs tracking-tighter">{formatDateFromString(comment.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

export default Comment