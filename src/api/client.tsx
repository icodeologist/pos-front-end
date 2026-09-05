import axios from "axios";

const apiClient = axios.create({
  // Vite proxies /api to the Go service in development. A deployed frontend
  // can point at a different service with VITE_API_URL.
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

export default apiClient;
