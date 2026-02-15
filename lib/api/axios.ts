// src/lib/axios.ts
import axios from "axios";
import { getAuthToken } from "@/lib/cookie"; // adjust path if needed

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // getAuthToken must be a client-safe function that returns the token string
      const token = await getAuthToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (err) {
      // don't block the request if token retrieval fails
      console.warn("axios interceptor: failed to read auth token", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
