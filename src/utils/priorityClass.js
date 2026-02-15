import adminStyles from "@/styles/admin.module.css";

export const getPriorityClass = (priority) => {
  switch (priority) {
    case "High":
      return adminStyles.priorityHigh;
    case "Medium":
      return adminStyles.priorityMedium;
    case "Low":
      return adminStyles.priorityLow;
    default:
      return adminStyles.priorityMedium;
  }
};
