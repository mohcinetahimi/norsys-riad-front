// import React, { createContext, useState, useContext } from 'react';

// const OpenContext = createContext();

// export const OpenProvider = ({ children }) => {
//   const [modals, setModals] = useState({});

//   const openModal = (modalName) => {
//     console.log(`Opening modal: ${modalName}`); 
//     setModals(prev => {
//       const updatedModals = { ...prev, [modalName]: true };
//       console.log('Current modals state after opening:', updatedModals); 
//       return updatedModals;
//     });
//   };

//   const closeModal = (modalName) => {
//     console.log(`Closing modal: ${modalName}`); 
//     setModals(prev => {
//       const updatedModals = { ...prev, [modalName]: false };
//       console.log('Current modals state after closing:', updatedModals); 
//       return updatedModals;
//     });
//   };

//   return (
//     <OpenContext.Provider value={{ modals, openModal, closeModal }}>
//       {children}
//     </OpenContext.Provider>
//   );
// };

// export const useOpen = () => {
//   const context = useContext(OpenContext);
//   if (!context) {
//     throw new Error('useOpen must be used within an OpenProvider');
//   }
//   return context;
// };

// export { OpenContext };


import React, { createContext, useState, useContext, useCallback } from 'react';

// Create the context
const OpenContext = createContext();

// Create the provider component
export const OpenProvider = ({ children }) => {
  const [modals, setModals] = useState({});

  // Function to open a modal by name
  const openModal = useCallback((modalName) => {
    console.log(`Opening modal: ${modalName}`); // Log when opening a modal
    setModals(prev => {
      const updatedModals = { ...prev, [modalName]: true };
      console.log('Current modals state after opening:', updatedModals); // Log the updated state
      return updatedModals;
    });
  }, []);

  // Function to close a specific modal by name
  const closeModal = useCallback((modalName) => {
    console.log(`Closing modal: ${modalName}`); // Log when closing a modal
    setModals(prev => {
      const updatedModals = { ...prev };
      delete updatedModals[modalName]; // Remove the modal from the state
      console.log('Current modals state after closing:', updatedModals); // Log the updated state
      return updatedModals;
    });
  }, []);

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
