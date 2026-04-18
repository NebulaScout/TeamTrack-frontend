import {
  PRIORITY_TO_API,
  PRIORITY_MAP,
  PROJECT_STATUS_MAP,
  PROJECT_STATUS_TO_API,
} from "./enumMappings";

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

// Transform backend project data to frontend format
export function mapProjectsFromAPI(apiProject) {
  const tasks = apiProject.project_tasks || [];
  const completedTasks = tasks.filter(
    (task) => task.status === "DONE" || task.status === "Completed",
  ).length;

  //   Calculate progress based on completed tasks
  const progress =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Determine project status based on dates or progress
  // const isCompleted = progress === 100;
  // const isPastDue = new Date(apiProject.end_date) < new Date();

  return {
    id: apiProject.id,
    name: apiProject.project_name,
    description: apiProject.description,
    progress,
    tasksCompleted: completedTasks,
    totalTasks: tasks.length,
    dueDate: apiProject.end_date,
    startDate: apiProject.start_date,
    status: PROJECT_STATUS_MAP[apiProject.status],
    priority: PRIORITY_MAP[apiProject.priority],
    createdBy: apiProject.created_by,
    createdAt: apiProject.created_at,
    teamMembers: (apiProject.members || []).map((member) => ({
      id: member.id,
      role: member.role,
      username: member.username,
      avatar: member.avatar || null,
    })),
    tasks: tasks,
  };
}

// Transform multiple projects
export function mapProjectsFromAPIs(apiProjects) {
  return apiProjects.map(mapProjectsFromAPI);
}

// Transform frontend project data to API request format
export const mapProjectToAPI = (frontendProjectData) => ({
  project_name: frontendProjectData.name,
  description: frontendProjectData.description || "",
  status: normalizeProjectStatusForAPI(frontendProjectData.status),
  priority: normalizeProjectPriorityForAPI(frontendProjectData.priority),
  start_date: frontendProjectData.startDate || null,
  end_date: frontendProjectData.dueDate || frontendProjectData.endDate || null,
});
