// src/components/Modal/RoomsModal.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../Admin/token/config';

const fetchRooms = async (riadId) => {
  const { data } = await axiosInstance.get(`/riads/${riadId}`);
  return data.rooms; // Assuming rooms are nested within the Riad object
};

const RoomsModal = ({ riadId, onClose }) => {
  const { data: rooms = [], error, isLoading } = useQuery({
    queryKey: ['rooms', riadId],
    queryFn: () => fetchRooms(riadId),
    enabled: !!riadId, // Only fetch if riadId is provided
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading rooms: {error.message}</div>;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-2xl font-semibold">Room Details</h3>
            <button
              onClick={onClose}
              className="text-red-500 hover:bg-red-100 rounded-full p-2 transition-colors"
            >
              <span className="sr-only">Close</span>&times;
            </button>
          </div>
          <div className="p-6">
            {rooms.length === 0 ? (
              <div className="text-center text-gray-500">No rooms available.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Room ID</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rooms.map((room) => (
                      <tr key={room.id}>
                        <td className="px-6 py-4 text-sm text-gray-500">{room.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{room.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{room.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsModal;
