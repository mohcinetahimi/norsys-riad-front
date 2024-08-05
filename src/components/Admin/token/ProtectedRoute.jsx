import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFlashMessage } from '../../../contexts/FlashMessageContext'; // Import useFlashMessage

const ProtectedRoute = ({ element: Component, requiredRole, ...rest }) => {
  const [isValid, setIsValid] = useState(null); // null for initial state, true/false for validation result
  const [role, setRole] = useState(null); // Store user role
  const { showFlashMessage } = useFlashMessage(); // Use the showFlashMessage function
  const navigate = useNavigate(); // Correctly initialize the navigate function

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('token_admin');

      if (!token) {
        showFlashMessage('Your session has ended. Please log in again.');
        setIsValid(false);
        navigate('/admin');
        return;
      }

      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        };

        const response = await axios.post('http://localhost:8000/api/validate-token', { admin: true }, config);

        if (response.status === 200 && response.data.valid) {
          setIsValid(true);
          setRole(response.data.role || ''); // Ensure role is set to a default value if not provided
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
  }, [navigate, showFlashMessage]); // Removed `isValid` dependency to avoid infinite loop

  if (isValid === null) {
    return <div>Loading...</div>; // Or a loading spinner, etc.
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
