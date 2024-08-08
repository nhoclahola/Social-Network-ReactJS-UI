import User from "./UserInterface";

export default interface Post {
  postId: string;
  caption: string;
  createdAt: string;
  imageUrl: string;
  user: User;
  likedCount: number;
  commentCount: number;
  liked: boolean;
};