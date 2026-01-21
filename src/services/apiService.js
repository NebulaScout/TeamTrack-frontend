import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add access token to every request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => Promise.reject(error),
);

// Handle token refresh upon expiry of access tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If it a 401 error and there has been no refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const response = await api.post("/api/token/refresh/", {
          refresh: refreshToken,
        });
        const { access } = response.data;
        localStorage.setItem("accessToken", access);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

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

export default api;
