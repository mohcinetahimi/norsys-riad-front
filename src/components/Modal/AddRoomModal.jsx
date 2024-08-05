import React from 'react';
import { useOpen } from '../../contexts/OpenContext'; // Ensure this path is correct
import AddRoom from '../Admin/Room/AddRoom'; // Import your AddRoom component

const AddRoomModal = ({ riadId }) => {
  const { modals, openModal, closeModal } = useOpen();

  return (
    <div>
      {/* Modal */}
      {modals[`modalManageRooms_${riadId}`] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-md shadow-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => closeModal(`modalManageRooms_${riadId}`)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Add New Room to Riad {riadId}</h2>
            <AddRoom riadId={riadId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRoomModal;
