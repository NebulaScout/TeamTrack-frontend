import adminStyles from "@/styles/admin.module.css";

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
