// src/contexts/FlashMessageContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const FlashMessageContext = createContext();

export const useFlashMessage = () => useContext(FlashMessageContext);

export const FlashMessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState('success'); // Default type

  const showFlashMessage = useCallback((msg, type = 'success', duration = 3000) => {
    setMessage(msg);
    setType(type);
    const timer = setTimeout(() => {
      setMessage(null);
    }, duration);

    return () => clearTimeout(timer); // Clear timeout on unmount
  }, []);

  return (
    <FlashMessageContext.Provider value={{ showFlashMessage }}>
      {children}
      {message && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white`}
          role="alert"
          aria-live="assertive"
        >
          {message}
        </div>
      )}
    </FlashMessageContext.Provider>
  );
};
