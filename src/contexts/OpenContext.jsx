import React, { createContext, useState, useContext } from 'react';

// Create the context
const OpenContext = createContext();

// Create the provider component
export const OpenProvider = ({ children }) => {
  const [modals, setModals] = useState({});

  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  return (
    <OpenContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </OpenContext.Provider>
  );
};

// Custom hook to use the context
export const useOpen = () => {
  const context = useContext(OpenContext);
  if (!context) {
    throw new Error('useOpen must be used within an OpenProvider');
  }
  return context;
};

// Export the context
export { OpenContext };
