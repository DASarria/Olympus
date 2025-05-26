import createClient from './ClienteAPI';
import { APIUser, endPointUser } from './ConfigurationAPI';


export const login = async (credentials) => {
  try{
    const client = createClient(APIUser);
    return await client.post(endPointUser.login, credentials);
  }catch(error){
    console.error("Error al obtener token con credenciales")
  }
};

export const find = async (filters,token) => {
  try{
    const client = createClient(APIUser,token);
    return await client.post(endPointUser.findUsers, filters);
  }catch(error){
    console.error("Error al obtener usuarios", error);
  }
    
};