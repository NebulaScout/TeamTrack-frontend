// import { mapCommentsFromAPI, mapCommentFromAPI } from "./commentsMapper";
import {
  STATUS_MAP,
  STATUS_TO_API,
  PRIORITY_MAP,
  PRIORITY_TO_API,
} from "./enumMappings";

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
  // status: STATUS_MAP[apiTask.status] || "To Do",
  priority: PRIORITY_MAP[apiTask.priority] || "Low",
  dueDate: apiTask.due_date || "",
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

  // map assignee data
  assignee: apiTask.assigned_to
    ? {
        id: apiTask.assigned_to.id,
        name: apiTask.assigned_to.username,
        avatar: apiTask.assigned_to.avatar,
        role: apiTask.assigned_to.role,
      }
    : null,

  // map creaed by user
  createdBy: apiTask.created_by
    ? {
        id: apiTask.created_by.id,
        name: apiTask.created_by.username,
        avatar: apiTask.created_by.avatar,
        role: apiTask.created_by.role,
      }
    : null,

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
