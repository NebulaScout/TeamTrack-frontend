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

// Map API project status codes to frontend status strings
const PROJECT_STATUS_MAP = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  ON_HOLD: "On hold",
};

const PROJECT_STATUS_TO_API = {
  Active: "ACTIVE",
  Completed: "COMPLETED",
  "On hold": "ON_HOLD",
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

const EVENT_TYPE_MAP = {
  MEETING: "Meeting",
  TASK: "Task",
  DEADLINE: "Deadline",
  REMINDER: "Reminder",
};

const EVENT_TYPE_TO_API = {
  Meeting: "MEETING",
  Task: "TASK",
  Deadline: "DEADLINE",
  Reminder: "REMINDER",
};

const ROLE_MAP = {
  DEVELOPER: "Developer",
  PROJECT_MANAGER: "Project Manager",
  ADMIN: "Admin",
  GUEST: "Guest",
};

const ROLE_TO_API = {
  Developer: "DEVELOPER",
  "Project Manager": "PROJECT_MANAGER",
  Admin: "ADMIN",
  Guest: "GUEST",
};

const ADMIN_TASK_STATUS_MAP = {
  TO_DO: "open",
  IN_PROGRESS: "in_progress",
  IN_REVIEW: "in_progress",
  DONE: "done",
};

const ADMIN_TASK_PRIORITY_MAP = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const AUDIT_ACTION_LABELS = {
  task_created: "created task",
  task_updated: "updated task",
  task_deleted: "deleted task",
  status_changed: "changed status",
  priority_changed: "changed priority",
  due_date_changed: "changed due date",
  task_assigned: "updated assignment",
  title_changed: "changed title",
  description_changed: "changed description",
};

export {
  STATUS_MAP,
  STATUS_TO_API,
  PRIORITY_MAP,
  PRIORITY_TO_API,
  EVENT_TYPE_MAP,
  EVENT_TYPE_TO_API,
  PROJECT_STATUS_MAP,
  PROJECT_STATUS_TO_API,
  ROLE_MAP,
  ROLE_TO_API,
  ADMIN_TASK_STATUS_MAP,
  ADMIN_TASK_PRIORITY_MAP,
  AUDIT_ACTION_LABELS,
};
