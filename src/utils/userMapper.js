export const mapUserFromAPI = (apiUser) => ({
  id: apiUser.id,
  username: apiUser.username,
  firstName: apiUser.first_name,
  lastName: apiUser.last_name,
  email: apiUser.email,
  avatar: apiUser.avatar,
  role: apiUser.role,
});

export const mapUsersFromAPI = (apiUsers) => apiUsers.map(mapUserFromAPI);
