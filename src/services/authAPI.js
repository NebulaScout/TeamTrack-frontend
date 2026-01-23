import api from "./APIService";

export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/api/v1/accounts/register/", {
      user: {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        username: userData.username || userData.email,
        password: userData.password,
        confirm_password: userData.confirmPassword,
      },
    });
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/api/token/", {
      username: credentials.username,
      password: credentials.password,
    });

    // Store auth tokens
    const { access, refresh } = response.data;
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    return response.data;
  },

  logout: async () => {
    await api.post("/api/v1/auth/logout/");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
