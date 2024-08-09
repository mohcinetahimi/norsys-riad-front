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
              <div className="space-y-4">
                {rooms.map((room) => (
                  <div key={room.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    <h4 className="text-xl font-semibold text-gray-800">Room ID: {room.id}</h4>
                    <p className="text-lg font-medium text-gray-700">Name: {room.name}</p>
                    <p className="text-gray-600">Description: {room.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsModal;
