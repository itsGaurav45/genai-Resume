import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
});

// Interceptor to attach token to headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Handle FormData properly
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
