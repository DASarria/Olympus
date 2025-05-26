import axios from "axios";
import { USER_API_URL } from "../pages/prestamosDeportivos/util/config";

const api = axios.create({ baseURL: USER_API_URL });

// Añadir interceptor para incluir el token en las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

