import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return axios({
    url: `${API}${endpoint}`,
    ...options,
    headers,
  });
}
