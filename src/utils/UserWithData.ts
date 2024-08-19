export default interface UserWithDataInterface {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  description: string | null;
  gender: boolean | null;
  avatarUrl: string | null;
  coverPhotoUrl: string | null;
  posts: number;
  followers: number;
  followings: number;
  follow: boolean;
};