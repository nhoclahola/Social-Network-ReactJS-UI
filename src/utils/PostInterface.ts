import User from "./UserInterface";

export default interface Post {
  postId: string;
  caption: string;
  createdAt: string;
  imageUrl: string | null;
  videoUrl: string | null;
  user: User;
  likedCount: number;
  commentCount: number;
  liked: boolean;
  saved: boolean;
};