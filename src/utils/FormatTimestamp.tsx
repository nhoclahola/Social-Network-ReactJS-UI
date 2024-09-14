export default function formatTimestamp(dateString: string): string {
  // Add 'Z' at the end of the string to indicate that dateString is in UTC
	const utcDateString = `${dateString}Z`;
  const date = new Date(utcDateString);
  const now = new Date();

  const isSameDay = date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return date.toLocaleTimeString('en-EN', { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString('en-EN', { 
      weekday: 'long', 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}