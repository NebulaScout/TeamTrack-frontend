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
};
