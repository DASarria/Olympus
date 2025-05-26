import createClient from './ClienteAPI';
import { API, endPointAssistance } from './ConfigurationAPI';

export const confirm = async (assistance, token) => {
  try{
    const client = createClient(API, token);
    return await client.put(endPointAssistance.confirm,assistance);
  }catch (error){
    console.error("Error al confirmar asistencia");
  }
};

export const confirmAll = async (assistance, token) => {
    try{
    const client = createClient(API, token);
    return await client.put(endPointAssistance.confirmAll,assistance);
    }catch(error){
        console.error("Error al confirmar todas las asistencias");
    }
};

export const createTeacher = async (assistance, token) => {
    try{
        const client = createClient(API, token);
        return await client.put(endPointAssistance.createTeacher,assistance);
    }catch(error){
        console.error("Error al crear asistencia");
    }
};

export const createStudent = async (assistance, token) => {
    try{
        const client = createClient(API, token);
        return await client.put(endPointAssistance.createStudent,assistance);
    }catch(error){
        console.error("Error al crear asistencia");
    }
};

export const find = async (filter, token) => {
    try{
        const client = createClient(API, token);
        return await client.post(endPointAssistance.find,filter);
    }catch(error){
        console.error("Error al buscar asistencia");
    }
};

export const del = async (assistance, token) => {
    try{
        const client = createClient(API, token);
        return await client.delete(endPointAssistance.delete,assistance);
    }catch(error){
        console.error("Error al eliminar la asistencia");
    }
};