import { formatDate } from "./formatDate";

// format relative time
export const formatRelativeTime = (dateString) => {
  if (!dateString) return "";

  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  // oledr comments show formatted date
  return formatDate(dateString);
};

// Map API comment to frontend format
export const mapCommentFromAPI = (apiComment) => ({
  id: apiComment.id,
  user: apiComment.author
    ? {
        id: apiComment.author.id,
        name: apiComment.author.username,
        avatar: apiComment.author.avatar,
        role: apiComment.author.role,
      }
    : null,
  message: apiComment.content,
  timestamp: formatRelativeTime(apiComment.created_at),
  rawTimeStamp: apiComment.created_at, // for sorting purposes
  taskId: apiComment.task,
});

export const mapCommentsFromAPI = (apiComments) => {
  if (!Array.isArray(apiComments)) return [];

  return apiComments.map(mapCommentFromAPI);
};

// Map comment for API request
export const mapCommentToAPI = (frontendComment, taskId) => ({
  task: taskId,
  content: frontendComment.message || frontendComment.content,
});
