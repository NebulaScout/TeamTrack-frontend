import adminStyles from "@/styles/admin.module.css";
import taskStyles from "@/styles/tasks.module.css";

export const getStatusClass = (status) => {
  switch (status?.toLowerCase().replace("_", "")) {
    case "active":
    case "completed":
    case "done":
      return adminStyles.statusActive;
    case "inactive":
    case "onhold":
    case "on hold":
      return adminStyles.statusInactive;
    case "inprogress":
    case "in progress":
      return adminStyles.statusInProgress;
    case "planning":
    case "open":
      return adminStyles.statusPlanning;
    default:
      return adminStyles.statusPlanning;
  }
};

export const getTaskStatusClass = (status) => {
  switch (status) {
    case "To Do":
      return taskStyles.statusTodo;
    case "In Progress":
      return taskStyles.statusInProgress;
    case "In Review":
      return taskStyles.statusInReview;
    case "Done":
      return taskStyles.statusDone;
    default:
      return taskStyles.statusTodo;
  }
};

export const getStatusDotClass = (status) => {
  switch (status) {
    case "To Do":
      return taskStyles.dotTodo;
    case "In Progress":
      return taskStyles.dotInProgress;
    case "In Review":
      return taskStyles.dotInReview;
    case "Done":
      return taskStyles.dotDone;
    default:
      return taskStyles.dotTodo;
  }
};
