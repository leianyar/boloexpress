import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@BoloExpress:token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      if (
        currentPath !== "/login" &&
        currentPath !== "/cadastro" &&
        currentPath !== "/"
      ) {
        localStorage.removeItem("@BoloExpress:token");
        localStorage.removeItem("@BoloExpress:user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;