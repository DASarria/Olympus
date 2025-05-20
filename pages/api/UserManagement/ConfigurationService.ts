import axios,{InternalAxiosRequestConfig} from "axios";

const USER_API_BASE_URL = "https://schedulemanagement-bqg2a7a3cgf8hfhc.eastus-01.azurewebsites.net/";

const api = axios.create({ baseURL: USER_API_BASE_URL });

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMTMyMTQxIiwidXNlck5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXNjdWVsYWluZy5lZHUuY28iLCJuYW1lIjoiZWwgYWRtaW4iLCJyb2xlIjoiQURNSU4iLCJzcGVjaWFsdHkiOiJudWxsIiwiZXhwIjoxNzQ3NzYxMjE0fQ.eTG6Z-uWiGHK5deqSC5cZJtzSgj8XJXwAxMgXEQqNZE';
    if (token && config.headers) {
      config.headers.Authorization = token;
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    console.error("❌ Error en el interceptor:", error);
    return Promise.reject(error);
  }
);
interface ConfigurationDTO {
  id: number;               
  name: string;             
  startTime: string;        
  endTime: string;          
}
interface response{
    status:string;
    message:string;
    data:ConfigurationDTO[];
}

async function getConfigurations():Promise<response> {
    try {
    const response = await api.get("configuration");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorBody = error.response?.data;
      return errorBody;
    }
    // Garantiza que la función no finaliza sin retornar
    const errorResponse:response = {
        status:"500",
        message:"Error Desconocido",
        data:[]
    }
    throw errorResponse;
  }
}
 
export default getConfigurations;