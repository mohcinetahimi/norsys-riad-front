import axios from 'axios';
import { useContext } from 'react';
import { FlashMessageContext } from '../../../contexts/FlashMessageContext';

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
    if (error.response && error.response.status === 401) {
        // Check if the error is due to an expired token
        if (error.response.data.message === 'Expired JWT Token') {
            // Handle token expiration logic
            localStorage.removeItem('token');
            
            // Use showFlashMessage function to display the flash message
            // Since we're in a non-component context, we cannot use useContext here.
            // Instead, use the global window.showFlashMessage that you exposed earlier.

            if (typeof window.showFlashMessage === 'function') {
                window.showFlashMessage('Session has expired. Please log in again.', 'error');
            }

            // Redirect to login page
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});

export default apiClient;
