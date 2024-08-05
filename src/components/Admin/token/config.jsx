import axios from 'axios';
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
      'Content-Type': 'application/ld+json',
      'Authorization': `Bearer ${localStorage.getItem('token_admin')}`, // Replace with your token retrieval method
    },
  });

export default axiosInstance;