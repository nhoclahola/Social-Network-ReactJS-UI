export default function truncateUsername(username: string, maxLength: number) {
  if (username.length > maxLength) {
    return username.substring(0, maxLength) + '...';
  }
  return username;
};