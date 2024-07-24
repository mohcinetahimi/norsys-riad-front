import React, { useState, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AddRoom from '../Room/AddRoom'; 
import { OpenContext } from '../../../contexts/OpenContext';
import ModalAdd from '../../Modal/ModalAdd';
import ModalEdit from '../../Modal/ModalEdit';
import axios from 'axios';
import { Button } from '@headlessui/react';

const fetchRooms = async () => {
  const { data } = await axios.get('http://localhost:3999/Rooms');  // Adjust the URL as necessary
  return data;
};

export default function Table() {
  const { setOpen } = useContext(OpenContext);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { data: rooms = [], error, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms
  });

  const deleteRoom = async (id) => {
    try {
      await axios.delete(`http://localhost:3999/Rooms/${id}`);  // Adjust the URL as necessary
      queryClient.invalidateQueries('rooms'); // Refetch rooms after deletion
    } catch (error) {
      console.error("There was an error deleting the room!", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <input 
  className='ml-44 p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out' 
  type='text' 
  placeholder='Start your search...' 
  onChange={(e) => {
    setSearch(e.target.value.toLowerCase());
  }} 
/>

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Rooms</h1>
          <p className="mt-2 text-sm text-gray-700">A table of Rooms.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add
          </button>
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
                    Room Name
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
                    Riad ID
                  </th>
                  <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rooms.filter(room => room.name.toLowerCase().includes(search)).map((room) => (
                  <tr key={room.id}>
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{room.name}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{room.description}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{room.nb_personne}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{room.price}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{room.id_riad}</td>
                    <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <ModalEdit roomId={room.id}/>  {/* Update this component to handle room edits */}
                    </td>
                    <td>
                      <button className={"bg-red-500 text-white font-bold py-2 px-2 mx-1 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"}
                        onClick={() => deleteRoom(room.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalAdd>
        
        <AddRoom />
      </ModalAdd>
    </div>
  );
}
