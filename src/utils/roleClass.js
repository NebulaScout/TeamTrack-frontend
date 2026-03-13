import adminStyles from "@/styles/admin.module.css";

export const getRoleClass = (role) => {
  switch (String(role ?? "").toLowerCase()) {
    case "admin":
      return adminStyles.roleAdmin;
    case "project manager":
      return adminStyles.roleProjectManager;
    case "developer":
      return adminStyles.roleDeveloper;
    case "guest":
      return adminStyles.roleGuest;
    case "moderator":
      return adminStyles.roleModerator;
    case "user":
      return adminStyles.roleUser;
    default:
      return adminStyles.roleUser;
  }
};
