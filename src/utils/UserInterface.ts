export default interface User {
  userId: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	gender: boolean | null;
	avatarUrl: string | null;
	coverPhotoUrl: string | null;
};