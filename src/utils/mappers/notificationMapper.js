const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "";
  const now = new Date();
  const past = new Date(timestamp);
  const diffInMs = now - past;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const mapNotificationFromAPI = (apiNotification) => ({
  id: apiNotification?.id,
  recipientId: apiNotification?.recipient ?? null,
  actorId: apiNotification?.actor ?? null,
  projectId: apiNotification?.project ?? null,
  auditLogId: apiNotification?.audit_log ?? null,
  category: apiNotification?.category ?? "",
  title: apiNotification?.title ?? "",
  message: apiNotification?.message ?? "",
  actionUrl: apiNotification?.action_url ?? "",
  metadata: apiNotification?.metadata ?? "",
  isRead: Boolean(apiNotification?.is_read),
  readAt: apiNotification?.read_at ?? "",
  createdAt: apiNotification?.created_at ?? "",
  time: formatTimeAgo(apiNotification?.created_at),
});

export const mapNotificationsFromAPI = (apiNotifications) =>
  (apiNotifications ?? []).map(mapNotificationFromAPI);
