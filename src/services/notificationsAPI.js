import api from "./APIService";

export const notificationsAPI = {
  getAll: async () => {
    const response = await api.get("/api/v1/notifications/");
    return response.data;
  },

  readAll: async (isRead = true) => {
    const response = await api.post("/api/v1/notifications/read-all/", {
      is_read: isRead,
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/v1/notifications/${id}/`);
    return response.data;
  },

  markAsRead: async (id, isRead = true) => {
    const response = await api.post(`/api/v1/notifications/${id}/read/`, {
      is_read: isRead,
    });
    return response.data;
  },
};
