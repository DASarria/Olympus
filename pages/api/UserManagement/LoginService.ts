import axios, { InternalAxiosRequestConfig } from 'axios';

// URL base
const USER_API_BASE_URL = "https://usermanagement-bhe9cfg4b5b2hthj.eastus-01.azurewebsites.net/";

// Crear instancia de axios
const api = axios.create({ baseURL: USER_API_BASE_URL });

// Configuración del interceptor para agregar el token de autorización
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem('token');
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

interface LogDTO{
    fullname:string;
    role:string;
    token:string;
  }
  interface response{
    status:string;
    message:string;
    data:LogDTO;
  }

async function login(credentials: { userName: string; password: string }): Promise<response> {
  try {
    const response = await api.post('authentication/login', credentials);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorBody = error.response?.data;
      return errorBody;
    }
    // Garantiza que la función no finaliza sin retornar
    throw error;
  }
}

export default login;