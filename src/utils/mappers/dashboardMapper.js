import { PRIORITY_MAP } from "./enumMappings";
import { resolveAssetUrl } from "../assetUrl";

// Map stats data to StatCard format
export const mapStatsFromAPI = (apiStats) => {
  const stats = [];

  if (apiStats) {
    // Total Tasks
    stats.push({
      title: "Total Tasks",
      value: apiStats.total_tasks.total.toString(),
      change:
        apiStats.total_tasks.change_pct !== 0
          ? `${apiStats.total_tasks.change_pct > 0 ? "+" : ""}${apiStats.total_tasks.change_pct}% vs last week`
          : null,
      positive: apiStats.total_tasks.change_pct >= 0,
      iconType: "blue",
    });

    // Completed Tasks
    stats.push({
      title: "Completed",
      value: apiStats.completed.total.toString(),
      change:
        apiStats.completed.change_pct !== 0
          ? `${apiStats.completed.change_pct > 0 ? "+" : ""}${apiStats.completed.change_pct}% vs last week`
          : null,
      positive: apiStats.completed.change_pct >= 0,
      iconType: "green",
    });

    // In Progress Tasks
    stats.push({
      title: "In Progress",
      value: apiStats.in_progress.total.toString(),
      change:
        apiStats.in_progress.change_pct !== 0
          ? `${apiStats.in_progress.change_pct > 0 ? "+" : ""}${apiStats.in_progress.change_pct}% vs last week`
          : null,
      positive: apiStats.in_progress.change_pct >= 0,
      iconType: "yellow",
    });

    // Overdue Tasks
    stats.push({
      title: "Overdue",
      value: apiStats.overdue.total.toString(),
      change:
        apiStats.overdue.change_pct !== 0
          ? `${apiStats.overdue.change_pct > 0 ? "+" : ""}${apiStats.overdue.change_pct}% vs last week`
          : null,
      positive: apiStats.overdue.change_pct < 0, // Negative change is positive for overdue
      iconType: "red",
    });
  }
  return stats;
};

// Map project progress from API
export const mapProjectProgressFromAPI = (apiProjects) => {
  return apiProjects?.map((project) => ({
    id: project.id,
    name: project.project_name,
    progress: Math.round(project.progress_pct),
    totalTasks: project.total_tasks,
    completedTasks: project.completed_tasks,
  }));
};

// Map recent activity from API
export const mapRecentActivityFromAPI = (apiActivities) => {
  // Activity type mapping for icons
  const activityTypeMap = {
    task_completed: "completed",
    task_created: "updated",
    task_updated: "updated",
    comment_added: "comment",
    member_joined: "joined",
    project_created: "updated",
  };

  // Action text mapping
  const actionTextMap = {
    task_completed: "completed task",
    task_created: "created task",
    task_updated: "updated task",
    comment_added: "commented on",
    member_joined: "joined project",
    project_created: "created project",
  };

  return apiActivities?.map((activity) => ({
    id: activity.id,
    user:
      `${activity.actor.first_name} ${activity.actor.last_name}`.trim() ||
      activity.actor.username,
    action: actionTextMap[activity.action_type] || "updated",
    task: activity.target_name,
    time: formatTimeAgo(activity.timestamp),
    type: activityTypeMap[activity.action_type] || "updated",
    avatar: resolveAssetUrl(activity.actor.avatar),
  }));
};

// Map upcoming deadlines from API
export const mapUpcomingDeadlinesFromAPI = (apiDeadlines) => {
  return apiDeadlines?.map((deadline) => ({
    id: deadline.id,
    title: deadline.title,
    fullTitle: deadline.title,
    project: deadline.project_name,
    priority: PRIORITY_MAP[deadline.priority] || deadline.priority,
    date: formatDeadlineDate(deadline.due_date),
    dueDate: deadline.due_date, // Keep original for sorting/comparison
    avatar: resolveAssetUrl(deadline.assigned_to?.avatar),
    assignedTo: deadline.assigned_to
      ? {
          id: deadline.assigned_to.id,
          username: deadline.assigned_to.username,
          firstName: deadline.assigned_to.first_name,
          lastName: deadline.assigned_to.last_name,
        }
      : null,
  }));
};

// Helper function to format timestamp to relative time
const formatTimeAgo = (timestamp) => {
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

// Helper function to format deadline date
const formatDeadlineDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset time parts for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";

  // Format as "Mon, DD MMM"
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

// Map entire dashboard response
export const mapDashboardFromAPI = (apiData) => ({
  stats: mapStatsFromAPI(apiData.stats),
  projectProgress: mapProjectProgressFromAPI(apiData.project_progress),
  recentActivity: mapRecentActivityFromAPI(apiData.recent_activity),
  upcomingDeadlines: mapUpcomingDeadlinesFromAPI(apiData.upcoming_deadlines),
});
