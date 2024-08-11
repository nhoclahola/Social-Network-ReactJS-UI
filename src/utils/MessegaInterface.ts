import User from "./UserInterface";

export default interface MessageInterface {
  messageId: string;
  content: string;
  imageUrl: string | null;
  timeStamp: string;
  user: User;
};