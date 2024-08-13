import User from "./UserInterface";

export default interface MessageInterface {
  messageId: string;
  content: string;
  imageUrl: string | null;
  timestamp: string;
  user: User;
};