import axios from 'axios';
import { Navigate } from 'react-router-dom';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  const authToken = JSON.parse(localStorage.getItem("auth"));

  if (authToken) {
    config.headers["auth-x-token"] = authToken;
  }
  return config;
});

export default api;
