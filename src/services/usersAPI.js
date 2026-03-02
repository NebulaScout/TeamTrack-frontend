import api from "./APIService";

export const usersAPI = {
  // Get all users (admin)
  getAll: async () => {
    const response = await api.get("/api/v1/accounts/users/");
    return response.data.data;
  },

  // Get a single user
  getById: async (id) => {
    const response = await api.get(`/api/v1/accounts/users/${id}/`);
    return response.data.data;
  },

  // Update a user (full update)
  update: async (id, userData) => {
    const response = await api.put(`/api/v1/accounts/users/${id}/`, userData);
    return response.data.data;
  },

  // Partial update (role, status, etc.)
  patch: async (id, userData) => {
    const response = await api.patch(`/api/v1/accounts/users/${id}/`, userData);
    return response.data.data;
  },

  // Delete a user
  delete: async (id) => {
    const response = await api.delete(`/api/v1/accounts/users/${id}/`);
    return response.data;
  },
};
