import axios from 'axios';

// Check if showFlashMessage is available globally
const showFlashMessage = window.showFlashMessage || ((msg, type) => console.log(`${type}: ${msg}`));

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token_admin');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    } else {
        window.location.href = '/admin'; 
    }
    return config;
}, error => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401 && error.response.data.message === 'Expired JWT Token') {
        localStorage.removeItem('token_admin');
        // Trigger flash message
        showFlashMessage('Session ended. Please log in again.', 'error');
        window.location.href = '/admin'; 
    }
    return Promise.reject(error);
});

export default apiClient;
