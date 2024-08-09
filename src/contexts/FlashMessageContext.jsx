import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const FlashMessageContext = createContext();

export const useFlashMessage = () => useContext(FlashMessageContext);

export const FlashMessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState('success'); // Default type

  const showFlashMessage = useCallback((msg, type = 'success') => {
    setMessage(msg);
    setType(type);
  }, []);

  const handleClose = () => {
    setMessage(null);
  };

  // Expose showFlashMessage globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.showFlashMessage = showFlashMessage;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.showFlashMessage;
      }
    };
  }, [showFlashMessage]);

  return (
    <FlashMessageContext.Provider value={{ showFlashMessage }}>
      {children}
      {message && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center justify-between">
            <span>{message}</span>
            <button
              onClick={handleClose}
              className="ml-4 bg-transparent text-white hover:text-gray-300"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </FlashMessageContext.Provider>
  );
};
