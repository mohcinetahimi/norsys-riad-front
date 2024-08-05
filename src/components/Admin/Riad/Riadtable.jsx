import React, { useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../token/config';
import { OpenContext } from '../../../contexts/OpenContext';
import { useFlashMessage } from '../../../contexts/FlashMessageContext';
import ModalAdd from '../../Modal/ModalAdd';
import ModalEdit from '../../Modal/ModalEdit';
import ModalImages from '../../Modal/ModalImages';
import AddRoomModal from '../../Modal/AddRoomModal';
import RoomsModal from '../../Modal/RoomsModal'; // Import the RoomsModal component
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'; 
import Navbar from '../../Navbar/navbar';

const fetchRiads = async () => {
  const { data } = await axiosInstance.get('/riads');
  return data;
};

const Table = () => {
  const { modals, openModal, closeModal } = useContext(OpenContext);
  const { showFlashMessage } = useFlashMessage();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedRiadId, setSelectedRiadId] = useState(null);

  const { data: riads = {}, error, isLoading } = useQuery({
    queryKey: ['riads'],
    queryFn: fetchRiads
  });

  const deleteRiad = async (id) => {
    try {
      await axiosInstance.delete(`/riads/${id}`);
      queryClient.invalidateQueries(['riads']);
      showFlashMessage('Riad deleted successfully!');
    } catch (error) {
      console.error("There was an error deleting the riad!", error);
      showFlashMessage('Failed to delete the riad. Please try again.');
    }
  };

  const extractIdFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const riadsList = Array.isArray(riads['hydra:member']) ? riads['hydra:member'] : [];
  const filteredRiads = riadsList.filter(riad =>
    riad.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <>
    <Navbar />
    <div className="px-4 sm:px-6 lg:px-8">
      <input 
        className='ml-44 p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out' 
        type='text' 
        placeholder='Start your search...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Riads</h1>
          <p className="mt-2 text-sm text-gray-700">A table of Riads.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => openModal('modalAdd')}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add
          </button>
          <ModalAdd />
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {filteredRiads.length === 0 ? (
              <div className="text-center text-gray-500">No Riads found.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Riad ID
                    </th>
                    <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Address
                    </th>
                    <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                      City
                    </th>
                    <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredRiads.map((riad) => (
                    <React.Fragment key={riad.id}>
                      <tr>
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{riad.id}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{riad.name}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{riad.description}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{riad.address}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{riad.city}</td>
                        <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <ModalEdit riadId={riad.id} />
                          <button
                            type="button"
                            onClick={() => deleteRiad(riad.id)}
                            className="text-red-600 hover:text-red-900 ml-2"
                            aria-label={`Delete Riad ${riad.id}`}
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRiadId(riad.id);
                              openModal(`modalManageRooms_${riad.id}`);
                            }}
                            className="text-blue-600 hover:text-blue-900 ml-2"
                            aria-label={`Add Room to Riad ${riad.id}`}
                          >
                            Add Room
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRiadId(riad.id);
                              openModal(`modalRooms_${riad.id}`);
                            }}
                            className="text-green-600 hover:text-green-900 ml-2"
                            aria-label={`View Rooms for Riad ${riad.id}`}
                          >
                            View Rooms
                          </button>
                        </td>
                        <td className="flex items-center space-x-2 py-2 pl-3 pr-4 bg-gray-100 rounded-md">
                          <ModalImages riadId={extractIdFromUrl(riad["@id"])} />
                          <CloudArrowUpIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </td>
                      </tr>
                      {modals[`modalManageRooms_${riad.id}`] && (
                        <AddRoomModal riadId={riad.id} />
                      )}
                      {modals[`modalRooms_${riad.id}`] && (
                        <RoomsModal riadId={riad.id} onClose={() => closeModal(`modalRooms_${riad.id}`)} />
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Table;
