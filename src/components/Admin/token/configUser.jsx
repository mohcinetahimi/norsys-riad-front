// src/api/apiConfig.js
import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', // Adjust the base URL as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    // if (!token) {
    //     window.location.href = '/'; 
    //     return;
    // }
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Add a response interceptor to handle expired tokens
apiClient.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401 && error.response.data.message === 'Expired JWT Token') {
        // Handle token expiration logic
        localStorage.removeItem('token');
        
        
    }
    return Promise.reject(error);
});

export default apiClient;
