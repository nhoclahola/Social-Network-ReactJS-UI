import { Avatar, CardMedia, Divider, IconButton, Tooltip, Typography, useTheme } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import React from 'react'
import { Link, useParams } from "react-router-dom"
import Post from "../../utils/PostInterface";
import formatDateFromString from "../../utils/ConvertDate";
import SendIcon from '@mui/icons-material/Send';
import { useAppSelector } from "../../redux/hook";
import Comment from "../../components/middle/post/Comment";
import axios from "axios";
import Loading from "./Loading";
import CommentInterface from "../../utils/CommentInterface";
import LoadingComment from "../../components/middle/post/LoadingComment";
import { API_BASE_URL } from "../../config/api";
import UserLikedModal from "../../components/middle/user_liked/UserLikedModal";


const stopDragging = (e: React.DragEvent) => {
  e.preventDefault();
};

const PostPage = () => {
  const { postId } = useParams();
  const theme = useTheme();

  const [post, setPost] = React.useState<Post | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<any>(null);

  // For update the liked and the comment count
  const auth = useAppSelector((store) => store.auth);
  const [newLikedCount, setNewLikedCount] = React.useState(post?.likedCount ? post?.likedCount : 0);
  const [newCommentCount, setNewCommentCount] = React.useState(post?.commentCount ? post?.commentCount : 0);
  const [isLiked, setIsLiked] = React.useState(post?.liked ? post?.liked : false);
  const [isSaved, setIsSaved] = React.useState(post?.saved ? post?.saved : false)

  // Open User Liked Modal
  const [openUserLiked, setOpenUserLiked] = React.useState(false);
  const handleOpenUserLiked = () => setOpenUserLiked(true);
  const handleCloseUserLiked = () => setOpenUserLiked(false);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`/api/posts/${postId}`, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then((response) => {
      setPost(response.data.result);
      setLoading(false);
    }).catch((error) => {
      setError(error);
      setLoading(false);
    })
  }, []);

  React.useEffect(() => {
    if (post) {
      setNewLikedCount(post.likedCount);
      setNewCommentCount(post.commentCount);
      setIsLiked(post.liked);
      setIsSaved(post.saved);
    }
  }, [post])

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

  const savePost = () => {
    axios.put(`/api/posts/${post?.postId}/save`, {}, {
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

  const [comments, setComments] = React.useState<CommentInterface[]>([]);
  const [loadingComment, setLoadingComment] = React.useState(false);
  const [isEnd, setIsEnd] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (post) {
      setLoadingComment(true);
      axios.get(`/api/comments/posts/${postId}`, {
        baseURL: API_BASE_URL,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
        },
        params: {
          index: index,
        }
      }).then((response) => {
        setComments((prev) => {
          const newComments = response.data.result.filter(
            (newComment: CommentInterface) => !prev.some((prevComment) => prevComment.commentId === newComment.commentId)
          );
          if (newComments.length < 5)
            setIsEnd(true);
          else
            setIsEnd(false);
          return [...newComments, ...prev];
        });
        setLoadingComment(false);
      }).catch((error) => {
        setLoadingComment(false);
      })
    }
  }, [post, index])

  const loadMoreComment = () => {
    setIndex((prev) => prev + 5);
  }

  const addComment = (content: string) => {
    axios.post(`/api/comments/posts/${postId}`, {
      content: content
    }, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then((response) => {
      setComments((prev) => {
        return [...prev, response.data.result];
      });
      setNewCommentCount((prev) => prev + 1);
    }).catch((error) => {
      console.error(error);
    })
  };

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.shiftKey && event.key === 'Enter') {
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      addComment(event.currentTarget.value);
      event.currentTarget.value = "";
    }
  };

  const handleSend = () => {
    if (inputRef.current) {
      addComment(inputRef.current.value);
      inputRef.current.value = "";
    }
  }

  if (loading)
    return (
      <Loading />
    )

  if (!post)
    return (
      <section className="h-2/4 flex flex-col justify-center items-center">
        <h1 className="font-bold text-xl">This post doesn't exist</h1>
        <h3 className="font-semibold">Try finding another post.</h3>
      </section>
    )

  return (
    <div className="w-full m-5 space-y-5">
      <section className="flex">
        <div>
          <Link to={`/profile/${post?.user.userId}`}>
            <Avatar onDragStart={stopDragging} className="outline outline-2 outline-slate-300" sx={{ width: "2.5rem", height: "2.5rem", margin: "0.5rem" }} aria-label="recipe">
              {post?.user.avatarUrl && <img src={post?.user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
            </Avatar>
          </Link>
        </div>
        <div className="flex flex-col gap-y-2 w-full">
          <div className="space-x-2">
            <Link to={`/profile/${post?.user.userId}`}>
              <span className="font-bold">{post?.user.firstName} {post?.user.lastName}</span>
            </Link>
            <span className="text-gray-500 text-sm">@{post?.user.username}</span>
            <span>·</span>
            <span className="text-gray-500 text-sm">{formatDateFromString(post?.createdAt ? post?.createdAt : "0")}</span>
          </div>
          <div className="min-h-12">
            <p className="whitespace-pre-line">{post?.caption}</p>
          </div>
          {post?.imageUrl ? <CardMedia
            className="cursor-pointer w-full rounded-md outline outline-1 outline-slate-300"
            component="img"
            image={post?.imageUrl}
            alt="post image"
          /> : post?.videoUrl && <video controls className="w-full rounded-md outline outline-1 outline-slate-300">
            <source src={post?.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>}
          <div className="flex justify-between">
            <section className="flex gap-x-4">
              <div>
                <IconButton className="hover:text-red-400" onClick={likePost}>
                  {isLiked ? <FavoriteIcon className="text-red-500" /> : <FavoriteIcon />}
                </IconButton>
                <span onClick={handleOpenUserLiked} className="hover:underline cursor-pointer">{newLikedCount}</span>
              </div>
              <div>
                <IconButton>
                  <ChatBubbleIcon className="text-cyan-400" />
                </IconButton>
                <span>{newCommentCount}</span>
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
      </section>
      <Divider />
      <section style={{ backgroundColor: theme.palette.background.paper }} className="pl-4 pt-5">
        <div>
          {!isEnd && <h1 onClick={loadMoreComment} className="mb-4 text-center font-serif text-cyan-700 py-2 px-4 cursor-pointer">Load more older comments</h1>}
          {loading && <LoadingComment />}
          <div className="space-y-2">
            {comments.map((comment) =>
              <Comment key={comment.commentId}
                comment={comment} />)}
          </div>
          {comments.length === 0 && <Typography className="text-center py-8">No comments</Typography>}
        </div>
        <div className="h-20 flex items-center gap-x-5 mx-3 mt-2">
          <Avatar>
            {auth?.user?.avatarUrl && <img src={auth.user.avatarUrl} alt="avatar" className="h-full w-auto object-cover" />}
          </Avatar>
          <div className="relative w-full">
            <textarea
              ref={inputRef} onKeyDown={handleKeyDown}
              rows={2} placeholder="Write your comment" title="comment"
              className="w-full resize-none outline-none bg-transparent border border-[#3b4054] rounded-lg px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <SendIcon
              onClick={handleSend}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-cyan-500"
            />
          </div>
        </div>
      </section>
      {openUserLiked && <UserLikedModal postId={postId} open={openUserLiked} handleClose={handleCloseUserLiked} />}
    </div>
  )
}

export default PostPage