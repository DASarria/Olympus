import axios,{InternalAxiosRequestConfig} from "axios";

const USER_API_BASE_URL = "https://scheculeproduction-fpgeb8c4b8abddfx.eastus-01.azurewebsites.net/configuration";
//const USER_API_BASE_URL = "http://localhost:8080/configuration";

const api = axios.create({ baseURL: USER_API_BASE_URL });

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem("token");
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
    const response = await api.get("");
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

interface responseDelete{
        status:string;
        message:string;
        data:null;
    }

export async function deleteConfiguration(name:string):Promise<responseDelete> {
    try {
    const response = await api.delete("",{params:{
      name:name
    }
    });
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

interface Interval{
  startTime: string;        
  endTime: string; 
  reason:string;
}
interface Configuration{
  id: string|null;               
  name: string;             
  startTime: string;        
  endTime: string;
  breakIntervals: Interval[];
  attentionIntervals: Interval[];
}
interface ResponseName{
  status:string;
  message:string;
  data:Configuration;
}
export async function getConfigurationByName(name: string): Promise<ResponseName> {

    try {
    const response = await api.get("/name",{
      params:{
        name:name
      }
    });
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

export async function CreateConfiguration(configuration:Configuration):Promise<responseDelete>{
  try {
    const response = await api.post("",configuration);
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