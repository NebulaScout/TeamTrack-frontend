import api from "./APIService";

export const dashboardAPI = {
  // Get dashboard data
  getAll: async () => {
    const response = await api.get("/api/v1/dashboard/");
    console.log("Dashboard data: ", response);
    return response.data.data;
  },
};
