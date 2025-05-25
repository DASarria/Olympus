import axios from "axios";
import { BASE_URL } from "@/config/config.js";

/**
 * Axios instance configured with base URL and default headers.
 * The instance is also equipped with request and response interceptors.
 * 
 * @typedef {Object} Api
 * @property {Function} interceptors.request.use - Intercepts and modifies outgoing requests.
 * @property {Function} interceptors.response.use - Intercepts incoming responses or errors.
 * 
 * @type {Api}
 */
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

/**
 * Request interceptor to add Authorization token to headers if available.
 * 
 * This function is triggered before sending a request. It checks if a token
 * exists in `localStorage` and appends it to the request headers if found.
 * 
 * @param {Object} config - Axios request configuration object.
 * @param {string} config.url - The request URL.
 * @param {Object} config.headers - The request headers.
 * @param {Object} config.params - The query parameters.
 * 
 * @returns {Object} The updated request configuration.
 * @throws {Error} Will throw an error if the interceptor fails.
 */
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response interceptor to handle API response or errors.
 * 
 * This function is triggered after receiving a response or an error from
 * the API. It logs the error message to the console if the response contains
 * an error.
 * 
 * @param {Object} response - Axios response object.
 * @param {Object} response.data - The response data from the API.
 * @param {number} response.status - The HTTP status code of the response.
 * 
 * @returns {Object} The response object.
 * @throws {Error} Will throw an error if the response contains an error.
 */
api.interceptors.response.use(
    response => response,
    error => {
        console.error("Error en la API:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;