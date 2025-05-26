import createClient from './Cliente';
import { API, endPointActivity } from './ConfigurationAPI';

export const update = (activity, token) => {
  const client = createClient(API, token);
  return client.put(endPointActivity.update, activity);
};

export const create = (activity, token) => {
    const client = createClient(API, token);
    return client.post(endPointActivity.create,activity);
};

export const find = (filters, token) => {
    const client = createClient(API, token);
    return client.get(endPointActivity.find,filters);
};

export const all = (token) => {
    const client = createClient(API, token);
    return client.get(endPointActivity.all);
};

export const del = (activity,token) => {
    const client = createClient(API, token);
    return client.delete(endPointActivity.delete);
};

