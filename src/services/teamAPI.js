import api from "./APIService";

export const teamAPI = {
  getStats: async (projectId) => {
    const response = await api.get(`/api/v1/projects/${projectId}/team/stats/`);
    console.log("Team stats: ", response);
    return response.data.data;
  },

  getMembers: async (projectId) => {
    const response = await api.get(
      `/api/v1/projects/${projectId}/team/members/`,
    );
    return response.data.data;
  },

  inviteTeamMember: async (projectId, inviteData) => {
    const response = await api.post(
      `/api/v1/projects/${projectId}/team/invite/`,
      inviteData,
    );
    console.log("Adding Member:", response);
    return response.data;
  },
};
