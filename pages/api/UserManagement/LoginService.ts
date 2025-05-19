import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// URL base
const USER_API_BASE_URL = "https://usermanagement-bhe9cfg4b5b2hthj.eastus-01.azurewebsites.net/";

// Crear instancia de axios
const api = axios.create({ baseURL: USER_API_BASE_URL });

// Configuración del interceptor para agregar el token de autorización
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    console.error("❌ Error en el interceptor:", error);
    return Promise.reject(error);
  }
);


async function login(credentials: { userName: string; password: string }): Promise<any> {
  try {
    const response = await api.post('authentication/login', credentials);
    return response.data; // Devuelve la respuesta
  } catch (error:unknown) {
    if (axios.isAxiosError(error)) {
      const errorBody = error.response?.data;
      return errorBody;
    }
  }
}

export default login;