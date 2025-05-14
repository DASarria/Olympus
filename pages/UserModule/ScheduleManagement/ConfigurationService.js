import axios from "axios";

const CONFIG_API_BASE_URL = "https://schedulemanagement-bqg2a7a3cgf8hfhc.eastus-01.azurewebsites.net/"
const token ="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMTMyMTQxIiwidXNlck5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXNjdWVsYWluZy5lZHUuY28iLCJuYW1lIjoiZWwgYWRtaW4iLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsInNwZWNpYWx0eSI6Im51bGwiLCJleHAiOjE3NDcxODE0OTN9.-vtj-FyaC2YNRmrlsAHHE-gjqOS0clFMht0b3w602L8"

class ConfigurationService{
    constructor() {
        this.api = axios.create({ baseURL: USER_API_BASE_URL });

        // Interceptor para incluir el token en cada solicitud
        this.api.interceptors.request.use(config => {
            const token = localStorage.getItem('token');
            
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                config.headers['Content-Type'] = 'application/json';
                console.log(token);
            }

            return config;
        }, error => {
            console.error("❌ Error en el interceptor:", error);
            return Promise.reject(error);
        });
    }
    setToken(token) {
        localStorage.setItem('token', token);
    }
    getConfigurations(){
        return this.api.get('configuration').then(res => res.data.data)
    }
}