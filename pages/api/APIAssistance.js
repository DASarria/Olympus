import createClient from './Cliente';
import { API, endPointAssistance } from './ConfigurationAPI';

export const confirm = (assistance, token) => {
  const client = createClient(API, token);
  return client.put(endPointAssistance.confirm,assistance);
};

export const confirmAll = (assistance, token) => {
    const client = createClient(API, token);
    return client.put(endPointAssistance.confirmAll,assistance);
};

export const createTeacher = (assistance, token) => {
    const client = createClient(API, token);
    return client.put(endPointAssistance.createTeacher,assistance);
};

export const createStudent = (assistance, token) => {
    const client = createClient(API, token);
    return client.put(endPointAssistance.createStudent,assistance);
};

export const find = (filter, token) => {
    const client = createClient(API, token);
    return client.get(endPointAssistance.find,filter);
};

export const del = (assistance, token) => {
    const client = createClient(API, token);
    return client.delete(endPointAssistance.delete,assistance);
};