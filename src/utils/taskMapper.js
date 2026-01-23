// Map API status codes to frontend status strings
const STATUS_MAP = {
  0: "To Do",
  1: "In Progress",
  2: "In Review",
  3: "Done",
};

// Reverse mapping for sending to API
const STATUS_TO_CODE = {
  "To Do": 0,
  "In Progress": 1,
  "In Review": 2,
  Done: 3,
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

// Transform API task response to frontend format
export const mapTaskFromAPI = (apiTask) => ({
  id: apiTask.id,
  title: apiTask.title,
  description: apiTask.description || "",
  project: apiTask.project || "", // TODO: fetch project name separately
  status: STATUS_MAP[apiTask.status] || "To Do",
  priority: PRIORITY_MAP[apiTask.priority] || "Low",
  dueDate: apiTask.due_date || "",
  createdAt: apiTask.created_at,
  comments: apiTask.comments || [],
  history: apiTask.history || [],

  assignee: { name: "", avatar: "" }, // TODO: Fetch assignee info from a separate user endpoint
});

// Transform frontend task data to API request format
export const mapTaskToAPI = (frontendTask) => ({
  title: frontendTask.title,
  description: frontendTask.description || "",
  priority: PRIORITY_TO_API[frontendTask.priority] || "LOW",
  due_date: frontendTask.dueDate | null,
  status: STATUS_TO_CODE[frontendTask.status] ?? 0,
  // TODO: include project API support in task schema
  ...(frontendTask.projectId && { project: frontendTask.projectId }),
});

// Transfrom an array of API tasks
export const mapTasksFromAPI = (apiTasks) => apiTasks.map(mapTaskFromAPI);

export { STATUS_MAP, STATUS_TO_CODE, PRIORITY_MAP, PRIORITY_TO_API };
