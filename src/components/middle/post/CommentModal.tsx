import { Avatar, Backdrop, Box, Divider, Fade, IconButton, Modal, Typography } from "@mui/material"
import axios from "axios";
import React from 'react'
import { API_BASE_URL } from "../../../config/api";
import Comment, { CommentProps } from "./Comment";
import LoadingComment from "./LoadingComment";
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: ".6rem",
  maxHeight: "90vh",
};

interface CommentModalProps {
  open: boolean;
  handleClose: () => void;
  postId: string;
};

const CommentModal = ({ open, handleClose, postId }: CommentModalProps) => {
  const [index, setIndex] = React.useState(0);
  const [data, setData] = React.useState<CommentProps[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isEnd, setIsEnd] = React.useState(false);

  const [addCommentLoading, setAddCommentLoading] = React.useState(false);
  const [addCommentError, setAddCommentError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`/api/comments/posts/${postId}`, {
      params: {
        index: index,
      },
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    })
      .then(response => {
        setData((prev) => {
          const newComments = response.data.result.filter(
            (newComment: CommentProps) => !prev.some((prevComment) => prevComment.commentId === newComment.commentId)
          );
          if (newComments.length < 5)
            setIsEnd(true);
          return [...newComments, ...prev];
        });
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [index]);

  const loadMoreComment = () => {
    setIndex((prev) => prev + 5);
  }

  const addComment = (content: string) => {
    setAddCommentLoading(true);
    axios.post(`/api/comments/posts/${postId}`, {
      content: content
    }, {
      baseURL: API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      }
    }).then(response => {
      setData((prev) => {
        return [...prev, response.data.result];
      });
      setAddCommentLoading(false);
    }).catch(error => {
      setAddCommentError(error);
      setAddCommentLoading(false);
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

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="flex justify-end">
              <CancelIcon sx={{ width: "2rem", height: "2rem" }} onClick={handleClose} className="hover:text-red-500 cursor-pointer" />
            </div>
            <div style={{ minHeight: "40vh", maxHeight: "60vh", overflowY: "auto" }}>
              {!isEnd && <h1 onClick={loadMoreComment} className="mb-4 text-center font-serif text-cyan-700 py-2 px-4 cursor-pointer">Load more older comments</h1>}
              {/* <Comment content="abc" commentId="sadasda" user={{ userId: "ác", email: "ac", firstName: "sc", lastName: "cc" }} createdAt="avva" /> */}
              {loading && <LoadingComment />}
              <div className="space-y-2">
                {data.map((comment) =>
                  <Comment key={comment.commentId}
                    commentId={comment.commentId}
                    content={comment.content}
                    createdAt={comment.createdAt}
                    user={comment.user} />)}
              </div>
              {data.length === 0 && <Typography className="text-center py-8">No comments</Typography>}
            </div>
            <Divider />
            <section className="h-20 flex items-center gap-x-5 mx-3">
              <Avatar sx={{}} />
              <div className="relative w-full">
                <textarea ref={inputRef} onKeyDown={handleKeyDown} rows={2} placeholder="Write your comment" title="comment"
                  className="w-full resize-none outline-none bg-transparent border border-[#3b4054] rounded-lg px-5 py-2" />
                <SendIcon
                  onClick={handleSend}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-cyan-500"
                />
              </div>
            </section>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default CommentModal