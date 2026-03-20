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

  getProjects: async () => {
    const response = await api.get("/api/v1/dashboard/admin/projects/");
    return response.data?.data ?? response.data ?? [];
  },

  getProjectById: async (id) => {
    const response = await api.get(`/api/v1/dashboard/admin/projects/${id}/`);
    return response.data?.data ?? response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(
      `/api/v1/dashboard/admin/projects/${id}/`,
    );
    return response.data?.data ?? response.data ?? null;
  },

  // Remove a member from a project team
  removeTeamMember: async (projectId, memberId) => {
    const response = await api.delete(
      `/api/v1/projects/${projectId}/team/members/${memberId}/`,
    );
    return response.data?.data ?? response.data;
  },

  // Admin tasks tab data (stats + tasks list)
  getTasks: async () => {
    const response = await api.get("/api/v1/dashboard/admin/tasks/");
    return response.data?.data ?? response.data ?? { stats: {}, tasks: [] };
  },

  patchTask: async (id, taskData) => {
    const response = await api.patch(
      `/api/v1/dashboard/admin/tasks/${id}/`,
      taskData,
    );
    return response.data?.data ?? response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/api/v1/dashboard/admin/tasks/${id}/`);
    return response.data?.data ?? response.data ?? null;
  },
};
