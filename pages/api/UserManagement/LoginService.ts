// En /pages/api/BaseService.ts
import axios, { InternalAxiosRequestConfig } from 'axios';

// URL base - deberías ponerla en variables de entorno
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://colliseum-gvh2h4bbd8bgcbfm.brazilsouth-01.azurewebsites.net/";
//const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://9eaizp3wsf.execute-api.us-east-1.amazonaws.com/";

// Crear instancia de axios
const api = axios.create({ baseURL: API_BASE_URL });

// Configuración del interceptor para agregar el token de autorización
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // No agregar token al endpoint de login
    if (config.url && config.url.includes('authentication/login')) {
      config.headers['Content-Type'] = 'application/json';
      return config;
    }
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