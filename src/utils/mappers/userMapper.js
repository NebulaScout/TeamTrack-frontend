export const mapUserFromAPI = (apiUser) => ({
  id: apiUser.id,
  username: apiUser.username,
  firstName: apiUser.first_name,
  lastName: apiUser.last_name,
  email: apiUser.email,
  avatar: apiUser.avatar,
  role: apiUser.role,
  status: apiUser.is_active ? "active" : "inactive",
  registered: apiUser.date_joined
    ? new Date(apiUser.date_joined).toLocaleDateString()
    : "--",
  projects: apiUser.projects_count ?? 0,
  tasks: apiUser.tasks_count ?? 0,
});

export const mapUsersFromAPI = (apiUsers) => apiUsers.map(mapUserFromAPI);
