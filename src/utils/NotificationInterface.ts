import Post from "./PostInterface";
import User from "./UserInterface";

export default interface NotificationInterface {
  notificationId: string;
  post: Post;
  triggerUser: User;
  notificationType: string;
  createdAt: string;
  read: boolean;
};