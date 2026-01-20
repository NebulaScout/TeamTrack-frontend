import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/api/v1/accounts/register/", {
      user: {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        username: userData.userName || userData.email,
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
    return response.data;
  },
};
