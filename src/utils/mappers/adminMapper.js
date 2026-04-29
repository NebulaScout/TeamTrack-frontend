import {
  PRIORITY_MAP,
  ADMIN_TASK_STATUS_MAP,
  ADMIN_TASK_PRIORITY_MAP,
  AUDIT_ACTION_LABELS,
  STATUS_COLORS,
  PRIORITY_COLORS,
} from "./enumMappings";
import { formatDate } from "../formatDate";
import { resolveAssetUrl } from "../assetUrl";

// Map overdue tasks from API
export const mapOverdueTasksFromAPI = (apiTasks) => {
  return apiTasks?.map((task) => {
    const assignee = task.assigned_to
      ? {
          name:
            (
              (task.assigned_to.first_name || "") +
              " " +
              (task.assigned_to.last_name || "")
            ).trim() || task.assigned_to.username,
          avatar: resolveAssetUrl(task.assigned_to.avatar),
          id: task.assigned_to.id,
          username: task.assigned_to.username,
        }
      : null;

    return {
      id: task.id,
      title: task.title,
      project: task.project_name,
      dueDate: formatDate(task.due_date),

      // canonical key
      assignee,

      // temporary backward-compat key; remove once UI is updated everywhere
      assigee: assignee,
    };
  });
};
// Map unassigned tasks from API
export const mapUnassignedTasksFromAPI = (apiTasks) => {
  return apiTasks?.map((task) => ({
    id: task.id,
    title: task.title,
    projectId: task.project_id,
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
    user_invited: "User invited by", // TODO: Correct this to user added
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

// Map a single admin user details response
export const mapAdminUserDetailsFromAPI = (apiUser) => ({
  id: apiUser.id,
  username: apiUser.username ?? "",
  firstName: apiUser.first_name ?? "",
  lastName: apiUser.last_name ?? "",
  email: apiUser.email ?? "",
  avatar: resolveAssetUrl(apiUser.avatar, ""),
  role: (apiUser.role ?? "user").toLowerCase(),
  status: (apiUser.status ?? "inactive").toLowerCase(),
  registeredOn: apiUser.registered_on ?? "",
  registered: formatDate(apiUser.registered_on),
  projectCount: apiUser.project_count ?? 0,
  taskCount: apiUser.task_count ?? 0,
});

// Map a single admin user from API
export const mapAdminUserFromAPI = (apiUser) => ({
  id: apiUser.id,
  username: apiUser.username,
  firstName: apiUser.first_name ?? "",
  lastName: apiUser.last_name ?? "",
  email: apiUser.email ?? "",
  avatar: resolveAssetUrl(apiUser.avatar, ""),
  role: (apiUser.role ?? "user").toLowerCase(),
  status: (apiUser.status ?? "inactive").toLowerCase(),
  registered: formatDate(apiUser.registered_on),
  projects: apiUser.project_count ?? 0,
  tasks: apiUser.task_count ?? 0,
});

// Map admin users list from API
export const mapAdminUsersFromAPI = (apiUsers) =>
  (apiUsers ?? []).map(mapAdminUserFromAPI);

const ADMIN_PROJECT_STATUS_MAP = {
  ACTIVE: "in progress",
  IN_PROGRESS: "in progress",
  ON_HOLD: "on hold",
  COMPLETED: "completed",
  PLANNING: "planning",
  PLANNED: "planning",
};

// Project's tab
const normalizeAdminProjectStatus = (status) => {
  const normalized = String(status ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  return (
    ADMIN_PROJECT_STATUS_MAP[normalized] ||
    String(status ?? "planning")
      .toLowerCase()
      .replace(/_/g, " ")
  );
};

const mapAdminProjectMembersToAvatars = (members, memberCount, ownerAvatar) => {
  let parsedMembers = members;

  if (typeof members === "string") {
    const trimmed = members.trim();

    if (!trimmed) {
      parsedMembers = [];
    } else if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        parsedMembers = JSON.parse(trimmed);
      } catch {
        parsedMembers = trimmed
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
      }
    } else {
      parsedMembers = trimmed
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    }
  }

  if (!Array.isArray(parsedMembers)) parsedMembers = [];

  const avatars = parsedMembers
    .map((member) => {
      if (typeof member === "string") return member;
      return member?.avatar ?? member?.profile_picture ?? "";
    })
    .filter(Boolean);

  if (avatars.length > 0) return avatars;

  const count = Number(memberCount) || 0;
  if (count <= 0) return [];

  const fallbackAvatar = ownerAvatar || "/vite.svg";
  return Array.from({ length: Math.min(count, 3) }, () => fallbackAvatar);
};

export const mapAdminProjectFromAPI = (apiProject) => {
  const owner = apiProject?.owner ?? {};

  return {
    id: apiProject?.id ?? apiProject?.project_id ?? apiProject?._id,
    name: apiProject?.project_name ?? "",
    description: apiProject?.description ?? "",
    status: normalizeAdminProjectStatus(apiProject?.status),
    created: formatDate(apiProject?.created_at),
    createdAt: apiProject?.created_at ?? "",
    startDate: apiProject?.start_date ?? "",
    endDate: apiProject?.end_date ?? "",
    priority: String(apiProject?.priority ?? "").toLowerCase(),
    owner: {
      id: owner?.id,
      username: owner?.username ?? "",
      name: owner?.full_name || owner?.username || "Unknown Owner",
      avatar: resolveAssetUrl(owner?.avatar),
    },
    members: mapAdminProjectMembersToAvatars(
      apiProject?.members,
      apiProject?.member_count,
      owner?.avatar,
    ),
    memberCount: apiProject?.member_count ?? 0,
    tasksCompleted: apiProject?.tasks_completed ?? 0,
    totalTasks: apiProject?.tasks_total ?? 0,
  };
};

export const mapAdminProjectsFromAPI = (apiProjects) =>
  (apiProjects ?? []).map(mapAdminProjectFromAPI);

const ADMIN_PRIORITY_MAP = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const normalizeAdminProjectPriority = (priority) => {
  const normalized = String(priority ?? "")
    .trim()
    .toUpperCase();

  return ADMIN_PRIORITY_MAP[normalized] || "Medium";
};

const normalizeMemberRole = (role) => {
  return String(role ?? "Member")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
};

const mapMemberObject = (member, index) => {
  if (typeof member === "string") {
    const name = member.trim();
    return {
      id: `member-${index}-${name}`,
      username: name,
      name,
      role: "Member",
      avatar: "",
    };
  }

  const username = member?.username ?? "";
  const fullName =
    member?.full_name ??
    member?.name ??
    `${member?.first_name ?? ""} ${member?.last_name ?? ""}`.trim();

  const displayName = fullName || username || `Member ${index + 1}`;

  return {
    id: member?.id ?? `member-${index}-${displayName}`,
    username,
    name: displayName,
    role: normalizeMemberRole(member?.role),
    avatar: resolveAssetUrl(member?.avatar || member?.profile_picture, ""),
  };
};

const parseAdminProjectMembers = (members) => {
  if (!members) return [];

  let parsed = members;

  if (typeof members === "string") {
    const trimmed = members.trim();
    if (!trimmed) return [];

    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        parsed = trimmed
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
      }
    } else {
      parsed = trimmed
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    }
  }

  if (Array.isArray(parsed)) {
    return parsed.map((member, index) => mapMemberObject(member, index));
  }

  if (typeof parsed === "object" && parsed !== null) {
    return Object.values(parsed).map((member, index) =>
      mapMemberObject(member, index),
    );
  }

  return [];
};

export const mapAdminProjectDetailsFromAPI = (apiProject) => {
  const owner = apiProject?.owner ?? {};
  const members = parseAdminProjectMembers(apiProject?.members);
  const tasksCompleted = Number(apiProject?.tasks_completed ?? 0);
  const tasksTotal = Number(apiProject?.tasks_total ?? 0);
  const progress =
    tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

  return {
    id: apiProject?.id ?? apiProject?.project_id ?? apiProject?._id,
    name: apiProject?.project_name ?? "",
    description: apiProject?.description ?? "",
    status: normalizeAdminProjectStatus(apiProject?.status),
    priority: normalizeAdminProjectPriority(apiProject?.priority),
    startDate: apiProject?.start_date ?? "",
    endDate: apiProject?.end_date ?? "",
    createdAt: apiProject?.created_at ?? "",
    created: formatDate(apiProject?.created_at),
    owner: {
      id: owner?.id,
      username: owner?.username ?? "",
      name: owner?.full_name || owner?.username || "Unknown Owner",
      avatar: owner?.avatar || "/vite.svg",
    },
    members,
    memberCount: Number(apiProject?.member_count ?? members.length ?? 0),
    tasksCompleted,
    totalTasks: tasksTotal,
    pendingTasks: Math.max(tasksTotal - tasksCompleted, 0),
    progress,
  };
};

// Tasks tab
const normalizeAdminTaskStatus = (status) => {
  const normalized = String(status ?? "")
    .trim()
    .toUpperCase();

  return ADMIN_TASK_STATUS_MAP[normalized] || "To Do";
};

const normalizeAdminTaskPriority = (priority) => {
  const normalized = String(priority ?? "")
    .trim()
    .toUpperCase();

  return ADMIN_TASK_PRIORITY_MAP[normalized] || "Low";
};

const normalizeIsOverdue = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;

  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  return ["true", "1", "yes", "y"].includes(normalized);
};

const mapAdminTaskAssignee = (assignee) => {
  if (!assignee) return null;

  if (typeof assignee === "string") {
    return {
      name: assignee,
      avatar: "/vite.svg",
    };
  }

  const fullName =
    `${assignee?.first_name ?? ""} ${assignee?.last_name ?? ""}`.trim() ||
    assignee?.full_name ||
    assignee?.username ||
    "Unknown User";

  return {
    id: assignee?.id,
    name: fullName,
    avatar: resolveAssetUrl(assignee?.avatar),
  };
};

export const mapAdminTaskFromAPI = (apiTask) => ({
  id: apiTask?.id,
  title: apiTask?.title ?? "",
  projectId: apiTask?.project_id ?? null,
  project: apiTask?.project_name ?? "",
  assignee: mapAdminTaskAssignee(apiTask?.assignee),
  status: normalizeAdminTaskStatus(apiTask?.status),
  priority: normalizeAdminTaskPriority(apiTask?.priority),
  dueDate: formatDate(apiTask?.due_date),
  rawDueDate: apiTask?.due_date ?? "",
  isOverdue: normalizeIsOverdue(apiTask?.is_overdue),
  createdAt: apiTask?.created_at ?? "",
  updatedAt: apiTask?.updated_at ?? "",
});

export const mapAdminTasksFromAPI = (apiData) => ({
  stats: {
    overdueCount: Number(apiData?.stats?.overdue_count ?? 0),
    unassignedCount: Number(apiData?.stats?.unassigned_count ?? 0),
  },
  tasks: (apiData?.tasks ?? []).map(mapAdminTaskFromAPI),
});

// Audit logs
const normalizeAuditType = (actionType, action, module) => {
  const joined = `${actionType ?? ""} ${action ?? ""}`.toLowerCase();
  const normalizedModule = String(module ?? "")
    .trim()
    .toLowerCase();

  if (joined.includes("assign")) return "assignment";
  if (joined.includes("create")) return "create";
  if (joined.includes("delete") || joined.includes("remove")) return "delete";
  if (joined.includes("register")) return "register";
  if (joined.includes("update") || joined.includes("edit")) return "update";
  if (normalizedModule === "system") return "system";

  return "other";
};

const formatAuditTimestamp = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return String(timestamp);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const stringifyAuditValue = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";

  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const parseMetadata = (metadata) => {
  if (!metadata) return null;
  if (typeof metadata === "object") return metadata;

  const asString = String(metadata).trim();
  if (!asString) return null;

  try {
    return JSON.parse(asString);
  } catch {
    return { raw: asString };
  }
};

const normalizeAuditAction = (action, actionType, description) => {
  const directDescription = String(description ?? "").trim();
  if (directDescription) return directDescription;

  const actionKey = String(action ?? "")
    .trim()
    .toLowerCase();
  if (actionKey) return actionKey.replace(/_/g, " ");

  const typeKey = String(actionType ?? "")
    .trim()
    .toLowerCase();
  if (AUDIT_ACTION_LABELS[typeKey]) return AUDIT_ACTION_LABELS[typeKey];
  if (typeKey) return typeKey.replace(/_/g, " ");

  return "performed action";
};

const mapAuditActor = (actor) => {
  const safeActor = actor ?? {};

  const fullName = String(
    safeActor.full_name ??
      safeActor.name ??
      (
        String(safeActor.first_name ?? "") +
        " " +
        String(safeActor.last_name ?? "")
      ).trim() ??
      safeActor.username ??
      "Unknown User",
  ).trim();

  return {
    id: safeActor.id ?? null,
    username: safeActor.username ?? "",
    name: fullName || safeActor.username || "Unknown User",
    avatar: resolveAssetUrl(safeActor.avatar),
  };
};

const normalizeModule = (module) => {
  const value = String(module ?? "")
    .trim()
    .toLowerCase();

  return value || "system";
};

const toTitleCase = (value) =>
  String(value ?? "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

export const mapAdminAuditLogFromAPI = (apiLog) => {
  const metadata = parseMetadata(apiLog?.metadata);

  const oldValueCandidate =
    metadata?.old_value ?? metadata?.old ?? metadata?.from ?? apiLog?.old_value;
  const newValueCandidate =
    metadata?.new_value ?? metadata?.new ?? metadata?.to ?? apiLog?.new_value;

  const oldValue = stringifyAuditValue(oldValueCandidate);
  const newValue = stringifyAuditValue(newValueCandidate);

  const module = normalizeModule(apiLog?.module);
  const action = normalizeAuditAction(
    apiLog?.action,
    apiLog?.action_type,
    apiLog?.description,
  );
  const type = normalizeAuditType(apiLog?.action_type, apiLog?.action, module);

  const targetType = String(apiLog?.target_type ?? "")
    .trim()
    .toLowerCase();
  const targetLabel =
    apiLog?.target_label ??
    metadata?.target_label ??
    (targetType ? `#${apiLog?.target_id ?? ""}` : "System");
  const projectName = apiLog?.project_name ?? "";

  return {
    id: apiLog?.id ?? null,
    user: mapAuditActor(apiLog?.actor),
    module,
    action,
    actionType: String(apiLog?.action_type ?? "").toLowerCase(),
    description: apiLog?.description ?? "",
    targetType,
    targetId: apiLog?.target_id ?? null,
    targetLabel,
    projectId: apiLog?.project_id ?? null,
    project: projectName,
    metadata,
    type,
    from: oldValue,
    to: newValue,
    assignedTo:
      type === "assignment"
        ? stringifyAuditValue(
            metadata?.assignee ?? metadata?.assigned_to ?? newValueCandidate,
          )
        : "",
    timestamp: apiLog?.timestamp ?? "",
    date: formatAuditTimestamp(apiLog?.timestamp),
    moduleLabel: toTitleCase(module),
    targetTypeLabel: targetType ? toTitleCase(targetType) : "System",
  };
};

export const mapAdminAuditLogsFromAPI = (apiData) => {
  const logs = Array.isArray(apiData?.logs) ? apiData.logs : [];
  return {
    logs: logs.map(mapAdminAuditLogFromAPI),
    totalCount: Number(apiData?.total_count ?? logs.length),
  };
};

// Anaylics mapping
const normalizeLabel = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const mapDonutBucket = (item, colorMap) => {
  const name = String(item?.name ?? "").trim();
  const key = normalizeLabel(name);
  return {
    name,
    value: Number(item?.value ?? 0),
    color: item?.color ?? colorMap[key] ?? "#6b7280",
  };
};

export const mapAdminAnalyticsFromAPI = (apiData = {}) => {
  const analyticsStats = Array.isArray(apiData?.analytics_stats)
    ? apiData.analytics_stats
    : [];

  const tasksByStatus = Array.isArray(apiData?.tasks_by_status)
    ? apiData.tasks_by_status.map((item) => mapDonutBucket(item, STATUS_COLORS))
    : [];

  const tasksByPriority = Array.isArray(apiData?.tasks_by_priority)
    ? apiData.tasks_by_priority.map((item) =>
        mapDonutBucket(item, PRIORITY_COLORS),
      )
    : [];

  const weeklyTaskProgress = Array.isArray(apiData?.weekly_task_progress)
    ? apiData.weekly_task_progress.map((item) => ({
        week: String(item?.week ?? ""),
        completed: Number(item?.completed ?? 0),
        pending: Number(item?.pending ?? 0),
      }))
    : [];

  const mostActiveUsers = Array.isArray(apiData?.most_active_users)
    ? apiData.most_active_users.map((user) => ({
        id: user?.id ?? null,
        name: String(user?.name ?? ""),
        created: Number(user?.created ?? 0),
        completed: Number(user?.completed ?? 0),
        avatar: resolveAssetUrl(user?.avatar, "/vite.svg"),
      }))
    : [];

  const usersWithMostAssignments = Array.isArray(
    apiData?.users_with_most_assignments,
  )
    ? apiData.users_with_most_assignments.map((user) => ({
        id: user?.id ?? null,
        name: String(user?.name ?? ""),
        tasks: Number(user?.tasks ?? 0),
        avatar: resolveAssetUrl(user?.avatar, "/vite.svg"),
      }))
    : [];

  const rawProjectsByTeamSize =
    apiData?.projects_by_team_size ?? apiData?.projects_by_team_size ?? [];

  const projectsByTeamSize = Array.isArray(rawProjectsByTeamSize)
    ? rawProjectsByTeamSize.map((project) => ({
        name: String(project?.name ?? ""),
        members: Number(project?.members ?? 0),
      }))
    : [];

  return {
    analyticsStats,
    tasksByStatus,
    tasksByPriority,
    weeklyTaskProgress,
    mostActiveUsers,
    usersWithMostAssignments,
    projectsByTeamSize,
  };
};
