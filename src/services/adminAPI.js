import api from "./APIService";

export const adminAPI = {
  // Get admin dashboard quick actions data
  getQuickActions: async () => {
    const response = await api.get("/api/v1/dashboard/admin/");
    console.log("Admin quick actions data: ", response);
    return response.data.data;
  },
};
