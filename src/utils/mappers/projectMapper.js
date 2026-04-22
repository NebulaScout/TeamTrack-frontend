import {
  PRIORITY_TO_API,
  PRIORITY_MAP,
  PROJECT_STATUS_MAP,
  PROJECT_STATUS_TO_API,
} from "./enumMappings";
import { resolveAssetUrl } from "../assetUrl";

const normalizeProjectProgress = (progress) => {
  if (progress === null || progress === undefined) return 0;

  const stringValue = String(progress).trim();
  if (!stringValue) return 0;

  const numericValue = Number.parseFloat(stringValue.replace(/%/g, ""));
  if (Number.isNaN(numericValue)) return 0;

  return Math.min(100, Math.max(0, Math.round(numericValue)));
};

const toNumber = (value, fallback = 0) => {
  const n = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isNaN(n) ? fallback : n;
};

const normalizeProjectStatusLabel = (status) => {
  const raw = String(status ?? "").trim();
  if (!raw) return "Active";

  const fromMap = PROJECT_STATUS_MAP[raw];
  if (fromMap) return fromMap;

  const normalized = raw.replace(/[-_]/g, " ").trim().toLowerCase();

  if (
    normalized === "active" ||
    normalized === "in progress" ||
    normalized === "inprogress"
  ) {
    return "Active";
  }

  if (normalized === "completed" || normalized === "done") {
    return "Completed";
  }

  if (normalized === "on hold" || normalized === "onhold") {
    return "On hold";
  }

  // fallback: title case unknown values
  return normalized.replace(/\b\w/g, (ch) => ch.toUpperCase());
};

const normalizeProjectPriorityLabel = (priority) => {
  const raw = String(priority ?? "").trim();
  if (!raw) return "Low";

  const fromMap = PRIORITY_MAP[raw];
  if (fromMap) return fromMap;

  const normalized = raw.toLowerCase();
  if (
    normalized === "low" ||
    normalized === "medium" ||
    normalized === "high"
  ) {
    return normalized.replace(/\b\w/g, (ch) => ch.toUpperCase());
  }

  return "Low";
};

const mapTeamMembers = (sourceMembers) => {
  if (!Array.isArray(sourceMembers)) return [];

  return sourceMembers.map((member, index) => ({
    id: member?.id ?? `member-${index}`,
    role: member?.role ?? "Member",
    username: member?.username ?? "",
    name: member?.name ?? member?.username ?? "Team member",
    avatar: resolveAssetUrl(member?.avatar),
  }));
};

// Transform backend project data to frontend format
export function mapProjectsFromAPI(apiProject) {
  const rawTasks = apiProject?.tasks ?? apiProject?.project_tasks ?? [];
  const tasks = Array.isArray(rawTasks) ? rawTasks : [];

  const completedTasksFromList = tasks.filter((task) => {
    const s = String(task?.status ?? "")
      .trim()
      .toUpperCase();
    return s === "DONE" || s === "COMPLETED";
  }).length;

  const totalTasks =
    apiProject?.total_tasks !== undefined
      ? toNumber(apiProject.total_tasks, tasks.length)
      : apiProject?.tasks_total !== undefined
        ? toNumber(apiProject.tasks_total, tasks.length)
        : tasks.length;

  const tasksCompleted =
    apiProject?.tasks_completed !== undefined
      ? toNumber(apiProject.tasks_completed, completedTasksFromList)
      : apiProject?.tasks_completed !== undefined
        ? toNumber(apiProject.tasks_completed, completedTasksFromList)
        : completedTasksFromList;

  return {
    id: apiProject?.id,
    name: apiProject?.name ?? apiProject?.project_name ?? "",
    description: apiProject?.description ?? "",
    progress: normalizeProjectProgress(
      apiProject?.progress ?? apiProject?.project_progress,
    ),
    tasksCompleted,
    totalTasks,
    dueDate: apiProject?.due_date ?? apiProject?.end_date ?? "",
    startDate: apiProject?.startDate ?? apiProject?.start_date ?? "",
    status: normalizeProjectStatusLabel(apiProject?.status),
    priority: normalizeProjectPriorityLabel(apiProject?.priority),
    createdBy: apiProject?.created_by ?? apiProject?.created_by ?? null,
    createdAt: apiProject?.created_at ?? apiProject?.created_at ?? "",
    teamMembers: mapTeamMembers(
      apiProject?.team_members ?? apiProject?.members,
    ),
    tasks,
  };
}

// Transform multiple projects
export function mapProjectsFromAPIs(apiProjects) {
  if (!Array.isArray(apiProjects)) return [];
  return apiProjects.map(mapProjectsFromAPI);
}

// Transform frontend project data to API request format
export const mapProjectToAPI = (frontendProjectData) => {
  const normalizeProjectStatusForAPI = (status) => {
    const normalized = String(status ?? "")
      .trim()
      .toLowerCase()
      .replace(/_/g, " ");

    if (
      normalized === "active" ||
      normalized === "in progress" ||
      normalized === "inprogress"
    ) {
      return "ACTIVE";
    }

    if (normalized === "on hold" || normalized === "onhold") {
      return "ON_HOLD";
    }

    if (normalized === "completed") {
      return "COMPLETED";
    }

    return "ACTIVE";
  };

  const normalizeProjectPriorityForAPI = (priority) => {
    const normalized = String(priority ?? "")
      .trim()
      .toLowerCase();

    switch (normalized) {
      case "low":
        return "LOW";
      case "medium":
        return "MEDIUM";
      case "high":
        return "HIGH";
      default:
        return "LOW";
    }
  };

  const payload = {
    project_name: frontendProjectData.name,
    description: frontendProjectData.description || "",
    status: normalizeProjectStatusForAPI(frontendProjectData.status),
    priority: normalizeProjectPriorityForAPI(frontendProjectData.priority),
    start_date: frontendProjectData.startDate || null,
    end_date:
      frontendProjectData.dueDate || frontendProjectData.endDate || null,
  };

  if (frontendProjectData.projectProgress !== undefined) {
    payload.project_progress = String(
      normalizeProjectProgress(frontendProjectData.projectProgress),
    );
  }

  return payload;
};
