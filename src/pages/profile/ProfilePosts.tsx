import React from 'react'
import PostCard from "../../components/middle/post/PostCard"
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import LoadingPost from "../../components/middle/loading_post/LoadingPost";

interface User {
  email: string;
  firstName: string;
  lastName: string;
};

interface Post {
  postId: string;
  caption: string;
  createdAt: string;
  imageUrl: string;
  user: User;
  likedCount: number;
  commentCount: number;
  liked: boolean;
};

interface ProfilePostsProps {
  userId: string | undefined;
};

const ProfilePosts = React.memo(({ userId }: ProfilePostsProps) => {
  const [index, setIndex] = React.useState(0);
  const [data, setData] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isEnd, setIsEnd] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`/api/posts/users/${userId}`, {
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
          const newPosts = response.data.result.filter(
            (newPost: Post) => !prev.some((prevPost) => prevPost.postId === newPost.postId)
          );
          console.log("newPosts", newPosts);
          if (newPosts.length < 10)
            setIsEnd(true);
          else
            setIsEnd(false);
          return [...prev, ...newPosts];
        });
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [index]);

  const loadMorePost = () => {
    setIndex((prev) => prev + 10);
  }

  return (
    <div className="space-y-5 w-[100%]">
      {data.map((item) => <div key={item.postId} className="border border-slate-100 rounded-md">
        <PostCard postId={item.postId} caption={item.caption}
          createdAt={item.createdAt} imageUrl={item.imageUrl} user={item.user} likedCount={item.likedCount}
          commentCount={item.commentCount} liked={item.liked} />
      </div>)}
      {loading && <LoadingPost />}
      {!isEnd && <h1 onClick={loadMorePost} className="mb-4 text-center font-serif text-cyan-700 py-2 px-4 cursor-pointer">Load more older posts</h1>}
    </div>
  )
})

export default ProfilePosts