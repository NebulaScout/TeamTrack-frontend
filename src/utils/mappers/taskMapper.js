// import { mapCommentsFromAPI, mapCommentFromAPI } from "./commentsMapper";
import {
  STATUS_MAP,
  STATUS_TO_API,
  PRIORITY_MAP,
  PRIORITY_TO_API,
} from "./enumMappings";

const mapTaskUser = (apiUser) => {
  if (!apiUser) return null;

  // Some endpoints return only an ID instead of a full object
  if (typeof apiUser !== "object") {
    return {
      id: apiUser,
      name: "",
      avatar: null,
      role: null,
    };
  }

  const fullName =
    `${apiUser.first_name ?? ""} ${apiUser.last_name ?? ""}`.trim() ||
    apiUser.username ||
    "";

  return {
    id: apiUser.id,
    name: fullName,
    avatar: apiUser.avatar ?? null,
    role: apiUser.role ?? null,
  };
};

export const mapTaskFromAPI = (apiTask) => ({
  id: apiTask.id,
  title: apiTask.title,
  description: apiTask.description || "",
  status: STATUS_MAP[apiTask.status] || "To Do",
  project: apiTask.project
    ? {
        id: apiTask.project.id,
        projectName: apiTask.project?.project_name,
      }
    : null,
  priority: PRIORITY_MAP[apiTask.priority] || "Low",
  dueDate: apiTask.due_date || "",

  // Added for user-level visibility filtering on Tasks page
  assignee: mapTaskUser(apiTask.assigned_to),
  createdBy: mapTaskUser(apiTask.created_by),
});

// Transform API task response to frontend format
export const mapTaskDetailsFromAPI = (apiTask) => ({
  id: apiTask.id,
  title: apiTask.title,
  description: apiTask.description || "",
  status: STATUS_MAP[apiTask.status] || "To Do",
  priority: PRIORITY_MAP[apiTask.priority] || "Low",
  dueDate: apiTask.due_date || "",

  // map project info
  project: apiTask.project
    ? {
        id: apiTask.project.id,
        projectName: apiTask.project.project_name,
      }
    : null,

  assignee: mapTaskUser(apiTask.assigned_to),
  createdBy: mapTaskUser(apiTask.created_by),

  // comments:
  //   apiTask.comments.length > 1
  //     ? mapCommentsFromAPI(apiTask.comments || [])
  //     : mapCommentFromAPI(apiTask.comments || []),
  // createdAt: apiTask.created_at,
  // history: apiTask.history || [],
});

// Transform frontend task data to API request format
export const mapTaskToAPI = (frontendTask) => ({
  project: frontendTask.project,
  title: frontendTask.title,
  description: frontendTask.description || "",
  assigned_to: frontendTask.assignee || null,
  priority: PRIORITY_TO_API[frontendTask.priority] || "LOW",
  due_date: frontendTask.dueDate || null,
  status: STATUS_TO_API[frontendTask.status] ?? "TO_DO",
});

// Transfrom an array of API tasks
export const mapTasksFromAPI = (apiTasks) => apiTasks.map(mapTaskFromAPI);
