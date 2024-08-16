import User from "./UserInterface";

export default interface CommentInterface {
  commentId: string;
  content: string;
  createdAt: string;
  user: User;
  likedCount: number;
  liked: boolean;
}