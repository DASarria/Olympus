import createClient from './ClienteAPI';
import { API, endPointActivity } from './ConfigurationAPI';

export const update = async (activity, token) => {
    try{
        const client = createClient(API, token);
        return await client.put(endPointActivity.update, activity);
    }catch(error){
        console.error("Error al actualizar actividad");
    }
  
};

export const create = async (activity, token) => {
    try{
        const client = createClient(API, token);
        return await client.post(endPointActivity.create,activity);
    }catch(error){
        console.error("Error al crear actividad");
    }
};

export const find = async (filters, token) => {
    try{
        const client = createClient(API, token);
        return await client.post(endPointActivity.find,filters);
    }catch(error){
        console.error("Error al buscar actividades");
    }
};

export const all = async (token) => {
    try{
        const client = createClient(API, token);
        return await client.get(endPointActivity.all);
    }catch(error){
        console.error("Error al obtener actividades",error);
    }
};

export const del = async (activity,token) => {
    try{
        const client = createClient(API, token);
        return await client.delete(endPointActivity.delete);
    }catch(error){
        console.error("Error al eliminar actividad");
    }
};

