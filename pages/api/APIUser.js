import createClient from './Cliente';
import { APIUser, endPointUser } from './ConfigurationAPI';


export const login = (credentials) => {
  const client = createClient(APIUser);
  return client.post(endPointUser.login, credentials);
};

export const find = (filters,token) => {
    const client = createClient(APIUser);
    return client.post(endPointUser.findUsers, filters);
};