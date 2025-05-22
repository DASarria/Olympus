export const BASE_URL ="https://9eaizp3wsf.execute-api.us-east-1.amazonaws.com/" ;//"http://localhost:8081/"//"https://9eaizp3wsf.execute-api.us-east-1.amazonaws.com/"

// Configuración de endpoints específicos
export const API_ENDPOINTS = {
    ARTICLES: {
      BASE: `${BASE_URL}Article`,
      GET_ALL: `${BASE_URL}Article`,
      CREATE: `${BASE_URL}Article`,
      UPDATE: (id) => `${BASE_URL}Article/${id}`,
      DELETE: (id) => `${BASE_URL}Article/${id}`,
    },
    LOANS: {
      BASE: `${BASE_URL}LoanArticle`,
      GET_ALL: `${BASE_URL}LoanArticle`,
      CREATE: `${BASE_URL}LoanArticle`,
      UPDATE: (id) => `${BASE_URL}LoanArticle/${id}`,
      DELETE: (id) => `${BASE_URL}LoanArticle/${id}`,
    },
  };