import axios from 'axios';

const createClient = (baseURL, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return axios.create({
    baseURL,
    headers,
  });   
};

export default createClient;
