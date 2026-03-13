import api from "./APIService";

export const adminAPI = {
  // Get admin dashboard quick actions data
  getQuickActions: async () => {
    const response = await api.get("/api/v1/dashboard/admin/");
    console.log("Admin quick actions data: ", response);
    return response.data.data;
  },

  getUsers: async () => {
    const response = await api.get("/api/v1/dashboard/admin/users/");
    return response.data?.data ?? response.data ?? [];
  },

  getUserById: async (id) => {
    const response = await api.get(`/api/v1/dashboard/admin/users/${id}/`);
    return response.data?.data ?? response.data;
  },

  // Patch admin user (role / active status)
  patchUser: async (id, userData) => {
    const response = await api.patch(
      `/api/v1/dashboard/admin/users/${id}/`,
      userData,
    );
    return response.data?.data ?? response.data;
  },
};
