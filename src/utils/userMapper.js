export const mapUserFromAPI = (apiUser) => ({
  id: apiUser.id,
  username: apiUser.username,
  firstName: apiUser.first_name,
  lastName: apiUser.last_name,
  fullName: `${apiUser.first_name} ${apiUser.last_name}`,
  email: apiUser.email,
  role: apiUser.role,
});

export const mapUsersFromAPI = (apiUsers) => apiUsers.map(mapUserFromAPI);
