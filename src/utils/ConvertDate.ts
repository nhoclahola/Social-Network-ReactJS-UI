export default function formatDateFromString(dateString: string): string {
	const date = new Date(dateString); // Chuyển đổi chuỗi ngày tháng thành đối tượng Date
	const now = new Date();
	const diffMs = now.getTime() - date.getTime(); // Sự chênh lệch tính bằng milliseconds
	const diffSec = Math.floor(diffMs / 1000); // Chênh lệch tính bằng seconds
	const diffMin = Math.floor(diffSec / 60); // Chênh lệch tính bằng minutes
	const diffHour = Math.floor(diffMin / 60); // Chênh lệch tính bằng hours
	const diffDay = Math.floor(diffHour / 24); // Chênh lệch tính bằng days

	if (diffMin < 60) {
		return `${diffMin} minutes ago`;
	} else if (diffHour < 24) {
		return `${diffHour} hours ago`;
	} else if (diffDay < 30) {
		return `${diffDay} days ago`;
	} else {
		return date.toISOString();
	}
}