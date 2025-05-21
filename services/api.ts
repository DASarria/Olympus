import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Asegúrate que coincida con tu backend
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token de autenticación si es necesario
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // o sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;