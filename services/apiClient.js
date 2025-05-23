// services/apiClient.ts
import axios from 'axios';
import { BACKEND_API_URL } from "../config/config";

const apiClient = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Interceptor para añadir token de autorización
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('Error response:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('Error request:', error.request);
      return Promise.reject({ message: 'No se recibió respuesta del servidor' });
    } else {
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default apiClient;