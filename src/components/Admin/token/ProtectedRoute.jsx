// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import apiClient from '../token/config'; // Import the configured API client
import { useFlashMessage } from '../../../contexts/FlashMessageContext'; 
import '../../../assets/style/loading.css';

const ProtectedRoute = ({ element: Component, requiredRole, ...rest }) => {
  const [isValid, setIsValid] = useState(null); 
  const [role, setRole] = useState(null); 
  const { showFlashMessage } = useFlashMessage(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('token_admin');

      if (!token) {
        navigate('/admin');
        return;
      }

      try {
        const response = await apiClient.post('/validate-token', { admin: true });

        if (response.status === 200 && response.data.valid) {
          setIsValid(true);
          setRole(response.data.role || ''); 
        } else {
          showFlashMessage('Unauthorized access.');
          setIsValid(false);
          navigate('/admin');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          if (error.response.data.message === 'Expired JWT Token') {
            showFlashMessage('Your session has expired. Please log in again.');
          } else {
            showFlashMessage('Unauthorized access.');
          }
          setIsValid(false);
          navigate('/admin');
        } else {
          console.error('Token validation failed:', error);
          showFlashMessage('An error occurred while validating the token.');
          setIsValid(false);
          navigate('/admin');
        }
        localStorage.removeItem('token_admin');
      }
    };

    checkTokenValidity();
  }, [navigate, showFlashMessage]); 

  if (isValid === null) {
    return (
      <div className="spinner-container">
      <div className="spinner"></div>
      <div className="loading-text">Loading...</div>
    </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/admin" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    showFlashMessage('You do not have permission to access this page.');
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component {...rest} role={role} />;
};

export default ProtectedRoute;
