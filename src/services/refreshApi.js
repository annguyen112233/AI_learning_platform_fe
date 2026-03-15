// src/api/refreshApi.js
import axios from 'axios';

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default refreshApi;
