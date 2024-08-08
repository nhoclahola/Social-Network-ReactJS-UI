export default interface UserWithDataInterface {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  description: string;
  gender: string;
  avatarUrl: string;
  coverPhotoUrl: string;
  posts: number;
  followers: number;
  followings: number;
  follow: boolean;
};