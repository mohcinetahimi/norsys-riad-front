import React from 'react';
import ReactDOM from 'react-dom';
import { useContext } from 'react';
import { OpenContext } from './OpenContext';
import '../assets/style/ConfirmationModal.css';
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  const { closeModal } = useContext(OpenContext);

  const handleConfirm = () => {
    onConfirm();
    closeModal('confirmationModal');
  };

  const handleCancel = () => {
    onCancel();
    closeModal('confirmationModal');
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">{message}</h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
