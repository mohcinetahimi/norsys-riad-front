import React, { useState, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@headlessui/react';
import AddRiad from '../Riad/AddRiad';
import { OpenContext } from '../../../contexts/OpenContext';
import ModalAdd from '../../Modal/ModalAdd';
import ModalEdit from '../../Modal/ModalEdit';
import UploadImage from '../../Test';
import ModalImages from '../../Modal/ModalImages';
import { CloudArrowUpIcon } from '@heroicons/react/24/solid'; 
import Navbar from '../Navbar/navbar';
import '../../../assets/style/loading.css';

const fetchRooms = async () => {
  const token = localStorage.getItem('token_admin');
  try {
    const { data } = await axios.get('http://localhost:8000/api/rooms', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!Array.isArray(data['hydra:member'])) {
      throw new Error('Invalid data format');
    }

    return data['hydra:member'];
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw new Error('Failed to fetch rooms');
  }
};

const extractIdFromUrl = (url) => {
  const parts = url.split('/');
  return parts[parts.length - 1];
};

export default function Table() {
  const { modals, openModal, closeModal } = useContext(OpenContext);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { data: rooms = [], error, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
  });

  const deleteRoom = async (id) => {
    try {
      const token = localStorage.getItem('token_admin');
      await axios.delete(`http://localhost:8000/api/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      queryClient.invalidateQueries('rooms'); // Refetch rooms after deletion
    } catch (error) {
      console.error("There was an error deleting the room:", error);
      alert('Failed to delete the room. Please try again.');
    }
  };

  if (isLoading) return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );  
  if (error) return <div>Error loading data</div>;

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">
            Rooms
          </div>
          <div className="flex items-center space-x-4">
            <input 
              className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-150 ease-in-out'
              type='text'
              placeholder='Search...'
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
            {/* <button
              type="button"
              onClick={() => openModal('modalAdd')}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Add
            </button> */}
          </div>
        </div>

        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
           
            <p className="mt-2 text-sm text-gray-700">A table of Rooms.</p>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Room ID
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Number of People
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {rooms.filter(room => room.name.toLowerCase().includes(search)).map((room) => (
                    <tr key={extractIdFromUrl(room["@id"])}>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{extractIdFromUrl(room["@id"])}</td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{room.name}</td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{room.description}</td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{room.nb_personne}</td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{room.price}</td>
                      <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex space-x-2">
                        <ModalEdit roomId={extractIdFromUrl(room["@id"])} />
                        <button
                          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                          onClick={() => deleteRoom(extractIdFromUrl(room["@id"]))}
                        >
                          Delete
                        </button>
                      </td>
                      <td className="flex items-center space-x-2 py-2 pl-3 pr-4 bg-gray-100 rounded-md">
                        <ModalImages roomId={extractIdFromUrl(room["@id"])} />
                        <CloudArrowUpIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <ModalAdd>
          <AddRiad />
        </ModalAdd>
      </div>
    </>
  );
}
