import api from "./APIService";

export const tasksAPI = {
  // Get all tasks
  getAll: async () => {
    const response = await api.get("/api/v1/tasks/");
    return response.data;
  },

  // Get a specific task
  getById: async (id) => {
    const response = await api.get(`/api/v1/tasks/${id}/`);
    console.log("Task details response: ", response);
    return response.data;
  },

  // Create a task
  create: async (projectId, taskData) => {
    const response = await api.post(
      `/api/v1/projects/${projectId}/tasks/`,
      taskData,
    );
    return response.data;
  },

  // Update a task
  update: async (id, taskData) => {
    const response = await api.put(`/api/v1/tasks/${id}/`, taskData);
    return response.data;
  },

  //   Partial update a task
  patch: async (id, taskData) => {
    const response = await api.patch(`/api/v1/tasks/${id}/`, taskData);
    return response.data;
  },

  // Delelte a task
  delete: async (id) => {
    const response = await api.delete(`/api/v1/tasks/${id}/`);
    return response.data;
  },

  // Comment endpoints
  getComments: async (id) => {
    const response = await api.get(`/api/v1/tasks/${id}/comments/`);
    console.log("Get comments: ", response);
    return response.data;
  },

  createComment: async (id, commentContent) => {
    const response = await api.post(
      `/api/v1/tasks/${id}/comments/`,
      commentContent,
    );
    return response.data;
  },
};
