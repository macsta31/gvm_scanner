// src/axios.js
// src/axios.ts
import axios, { AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

export default instance;

