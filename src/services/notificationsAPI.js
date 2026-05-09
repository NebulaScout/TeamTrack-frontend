import api from "./APIService";

export const notificationsAPI = {
  getAll: async () => {
    const response = await api.get("/api/v1/notifications/");
    return response.data;
  },
};
