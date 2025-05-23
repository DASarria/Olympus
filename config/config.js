export const USER_API_URL = "https://9eaizp3wsf.execute-api.us-east-1.amazonaws.com/";
export const BACKEND_API_URL = "https://colliseum-gvh2h4bbd8bgcbfm.brazilsouth-01.azurewebsites.net/";

// Configuración de endpoints específicos
export const API_ENDPOINTS = {
    ARTICLES: {
      BASE: `${BACKEND_API_URL}Article`,
      GET_ALL: `${BACKEND_API_URL}Article`,
      CREATE: `${BACKEND_API_URL}Article`,
      UPDATE: (id) => `${BACKEND_API_URL}Article/${id}`,
      DELETE: (id) => `${BACKEND_API_URL}Article/${id}`,
    },
    LOANS: {
      BASE: `${BACKEND_API_URL}LoanArticle`,
      GET_ALL: `${BACKEND_API_URL}LoanArticle`,
      CREATE: `${BACKEND_API_URL}LoanArticle`,
      UPDATE: (id) => `${BACKEND_API_URL}LoanArticle/${id}`,
      DELETE: (id) => `${BACKEND_API_URL}LoanArticle/${id}`,
    },
  };