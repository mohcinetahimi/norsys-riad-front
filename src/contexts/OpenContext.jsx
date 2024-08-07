import React, { createContext, useState } from 'react';

export const OpenContext = createContext();

export const OpenProvider = ({ children }) => {
    const [modals, setModals] = useState({
        modalAdd: false,
        modalEdit: false,
        modalImages: false,
    });

    const openModal = (modal) => {
        setModals(prev => ({ ...prev, [modal]: true }));
    };

    const closeModal = (modal) => {
        setModals(prev => ({ ...prev, [modal]: false }));
    };

    return (
        <OpenContext.Provider value={{ modals, openModal, closeModal }}>
            {children}
        </OpenContext.Provider>
    );
};
