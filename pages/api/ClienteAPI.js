import axios from 'axios';

const createClient = (baseURL, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  //const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJOYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGVzY3VlbGFpbmcuZWR1LmNvIiwibmFtZSI6ImVsIGFkbWluIiwicm9sZSI6IkFETUlOIiwic3BlY2lhbHR5IjoibnVsbCIsImV4cCI6MTc0ODc0MDc1MX0.lWinHscYYgVhOnMvkGDyFMWt5KVjzrGxxxn2BnQIRBE";

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return axios.create({
    baseURL,
    headers,
  });   
};

export default createClient;
