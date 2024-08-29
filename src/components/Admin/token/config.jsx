import axios from 'axios';
import { useFlashMessage } from '../../../contexts/FlashMessageContext'; // Adjust the path if necessary

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
        // Redirect to login if token is missing
        window.location.href = '/admin/login';
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
        
        // Use FlashMessageProvider's context to trigger flash message
        const { showFlashMessage } = useFlashMessage();
        showFlashMessage('Session expired. Please log in again.', 'error');

        // Redirect to login
        window.location.href = '/admin/login';
    }
    return Promise.reject(error);
});

export default apiClient;
