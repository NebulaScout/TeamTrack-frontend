import adminStyles from "@/styles/admin.module.css";

export const getRoleClass = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return adminStyles.roleAdmin;
    case "moderator":
      return adminStyles.roleModerator;
    case "user":
      return adminStyles.roleUser;
    default:
      return adminStyles.roleUser;
  }
};
