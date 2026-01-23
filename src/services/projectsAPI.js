import api from "./APIService";

export const projectsAPI = {
  // get all projects
  getAll: async () => {
    const response = await api.get("/api/v1/projects/");
    return response.data;
  },

  // Get a single project
  getById: async (id) => {
    const response = await api.get(`/api/v1/projects/${id}`);
    return response.data;
  },

  // create a new project
  create: async (projectData) => {
    const response = await api.post("/api/v1/projects/", {
      project_name: projectData.name,
      description: projectData.description,
      start_date: projectData.startDate,
      end_date: projectData.dueDate,
    });
    return response.data;
  },

  // update project
  update: async (id, projectData) => {
    const response = await api.put(`/api/v1/projects/${id}/`, projectData);
    return response.data;
  },

  // delete project
  delete: async (id) => {
    const response = await api.delete(`/api/v1/projects/${id}/`);
    return response.data;
  },
};
