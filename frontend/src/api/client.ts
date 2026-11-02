import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL ??
    "https://fullstack-claro.onrender.com/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
