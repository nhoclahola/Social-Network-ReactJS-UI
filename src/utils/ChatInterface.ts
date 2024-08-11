import User from "./UserInterface";

export default interface ChatInterface {
  chatId: string;
  chatName: string;
  chatImageUrl: string;
  timestamp: string;
  users: User[];
}