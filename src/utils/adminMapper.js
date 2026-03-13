import { PRIORITY_MAP } from "./enumMappings";
import { formatDate } from "./formatDate";

// Map overdue tasks from API
export const mapOverdueTasksFromAPI = (apiTasks) => {
  return apiTasks?.map((task) => ({
    id: task.id,
    title: task.title,
    project: task.project_name,
    dueDate: formatDate(task.due_date),
    assigee: task.assigned_to
      ? {
          name:
            `${task.assigned_to.first_name} ${task.assigned_to.last_name}`.trim() ||
            task.assigned_to.username,
          avatar: task.assigned_to.avatar,
          id: task.assigned_to.id,
          username: task.assigned_to.username,
        }
      : null,
  }));
};

// Map unassigned tasks from API
export const mapUnassignedTasksFromAPI = (apiTasks) => {
  return apiTasks?.map((task) => ({
    id: task.id,
    title: task.title,
    project: task.project_name,
    priority: PRIORITY_MAP[task.priority] || task.priority,
  }));
};

// Map recent activity from API for admin
export const mapAdminRecentActivityFromAPI = (apiActivities) => {
  return apiActivities?.map((activity) => {
    // Format the action description
    const actionText = getActionText(
      activity.action_type,
      activity.description,
    );

    return {
      id: activity.id,
      action: actionText,
      user: activity.actor_name,
      time: formatTimeAgo(activity.timestamp),
    };
  });
};

// Helper function to format activity action text
const getActionText = (actionType, description) => {
  const actionTypeMap = {
    user_registered: "New user registered by",
    task_completed: "Task completed by",
    task_created: "Task created by",
    project_created: "Project created by",
    user_invited: "User invited by",
    comment_added: "Comment added by",
    task_updated: "Task updated by",
  };

  return actionTypeMap[actionType] || description || "Action performed by";
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

// Map entire admin quick actions response
export const mapAdminQuickActionsFromAPI = (apiData) => ({
  overdueTasks: mapOverdueTasksFromAPI(apiData.overdue_tasks),
  unassignedTasks: mapUnassignedTasksFromAPI(apiData.unassigned_tasks),
  recentActivity: mapAdminRecentActivityFromAPI(apiData.recent_activity),
});
