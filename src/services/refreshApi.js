// src/api/refreshApi.js
import axios from 'axios';

const refreshApi = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

export default refreshApi;
