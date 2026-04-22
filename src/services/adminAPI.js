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

  updateProject: async (id, payload) => {
    const response = await api.patch(
      `/api/v1/dashboard/admin/projects/${id}/`,
      payload,
    );
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

  addProjectMember: async (projectId, payload) => {
    const response = await api.post(
      `/api/v1/projects/${projectId}/team/members/`,
      payload,
    );
    return response.data?.data ?? response.data;
  },

  updateProjectMember: async (projectId, memberId, payload) => {
    const response = await api.patch(
      `/api/v1/projects/${projectId}/team/members/${memberId}/`,
      payload,
    );
    return response.data?.data ?? response.data;
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

  getProjectMembers: async (projectId) => {
    const response = await api.get(
      `/api/v1/dashboard/admin/projects/${projectId}/members/`,
    );
    return response.data?.data ?? response.data ?? null;
  },

  getAuditLogs: async (params = {}) => {
    const normalized = {};

    const search = String(params.search ?? "").trim();
    if (search) normalized.search = search;

    if (params.project && params.project !== "all") {
      normalized.project = params.project;
    }

    if (params.user && params.user !== "all") {
      normalized.user = params.user;
    }

    // New endpoint filters
    if (params.module && params.module !== "all") {
      normalized.module = params.module;
    }

    // Action/action_type support (keep both for backend compatibility)
    if (params.action && params.action !== "all") {
      normalized.action = params.action;
      normalized.action_type = params.action;
    }

    if (params.action_type && params.action_type !== "all") {
      normalized.action_type = params.action_type;
    }

    if (params.target_type && params.target_type !== "all") {
      normalized.target_type = params.target_type;
    }

    // Keep legacy filter passthrough if backend still supports it
    if (params.change_type && params.change_type !== "all") {
      normalized.change_type = params.change_type;
    }

    const requestedLimit = Number(params.limit);
    if (Number.isFinite(requestedLimit) && requestedLimit > 0) {
      normalized.limit = Math.min(requestedLimit, 200);
    } else {
      normalized.limit = 50;
    }

    const response = await api.get("/api/v1/dashboard/admin/audit-logs/", {
      params: normalized,
    });
    console.log("Audit response", response);

    return response.data?.data ?? response.data ?? { logs: [], total_count: 0 };
  },
};
