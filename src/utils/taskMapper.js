import { projectsAPI } from "@/services/projectsAPI";
import { authAPI } from "@/services/authAPI";
import { mapUserFromAPI } from "./userMapper";

// Map API status codes to frontend status strings
const STATUS_MAP = {
  TO_DO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

// Reverse mapping for sending to API
const STATUS_TO_API = {
  "To Do": "TO_DO",
  "In Progress": "IN_PROGRESS",
  "In Review": "IN_REVIEW",
  Done: "DONE",
};

const PRIORITY_MAP = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

// Reverse mapping for sending to API
const PRIORITY_TO_API = {
  Low: "LOW",
  Medium: "MEDIUM",
  High: "HIGH",
};

const getProjectName = async (projectId) => {
  try {
    const data = await projectsAPI.getById(projectId);
    return data.project_name;
  } catch (err) {
    console.error("Unable to fetch project name: ", err);
  }
};

const getAssigneeData = async (assigneeId) => {
  const assigneeData = await authAPI.getUserById(assigneeId);
  const data = mapUserFromAPI(assigneeData);
  return data.fullName;
};

// Transform API task response to frontend format
export const mapTaskFromAPI = (apiTask) => ({
  id: apiTask.id,
  title: apiTask.title,
  description: apiTask.description || "",
  project: getProjectName(apiTask.project) || "", // TODO: fetch project name separately
  status: STATUS_MAP[apiTask.status] || "To Do",
  priority: PRIORITY_MAP[apiTask.priority] || "Low",
  dueDate: apiTask.due_date || "",
  createdAt: apiTask.created_at,
  comments: apiTask.comments || [],
  history: apiTask.history || [],

  // assignee: { name: "", avatar: "" }, // TODO: Fetch assignee info from a separate user endpoint
  assignee: {
    name: getAssigneeData(apiTask.assigned_to),
    avatar: "https://placehold.co/32x32",
  },
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
  // TODO: include project API support in task schema
  // ...(frontendTask.projectId && { project: frontendTask.projectId }),
});

// Transfrom an array of API tasks
export const mapTasksFromAPI = (apiTasks) => apiTasks.map(mapTaskFromAPI);

export { STATUS_MAP, STATUS_TO_API, PRIORITY_MAP, PRIORITY_TO_API };
