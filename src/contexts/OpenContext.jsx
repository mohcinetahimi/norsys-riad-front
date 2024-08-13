import React, { createContext, useState, useContext } from 'react';

// Create the context
const OpenContext = createContext();

// Create the provider component
export const OpenProvider = ({ children }) => {
  const [modals, setModals] = useState({});

  const openModal = (modalName) => {
    console.log(`Opening modal: ${modalName}`); // Log when opening a modal
    setModals(prev => {
      const updatedModals = { ...prev, [modalName]: true };
      console.log('Current modals state after opening:', updatedModals); // Log the updated state
      return updatedModals;
    });
  };

  const closeModal = (modalName) => {
    console.log(`Closing modal: ${modalName}`); // Log when closing a modal
    setModals(prev => {
      const updatedModals = { ...prev, [modalName]: false };
      console.log('Current modals state after closing:', updatedModals); // Log the updated state
      return updatedModals;
    });
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
