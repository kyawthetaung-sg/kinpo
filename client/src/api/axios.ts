import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      const isAdminRoute = window.location.pathname.includes("/admin");
      window.location.href = isAdminRoute ? "/admin/login" : "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
