import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../token/config';
import { OpenContext } from '../../../contexts/OpenContext';
import { useFlashMessage } from '../../../contexts/FlashMessageContext';
import ModalAdd from '../../Modal/ModalAdd';
import ModalEdit from '../../Modal/ModalEdit';
import ModalImages from '../../Modal/ModalImages';
import AddRoomModal from '../../Modal/AddRoomModal';
import RoomsModal from '../../Modal/RoomsModal'; // Import the RoomsModal component
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'; 
import Navbar from '../Navbar/navbar';
import '../../../assets/style/loading.css';

const fetchRiads = async () => {
  const { data } = await axiosInstance.get('/riads');
  return data;
};

const Table = () => {
  const { modals, openModal, closeModal } = useContext(OpenContext);
  const { showFlashMessage } = useFlashMessage();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filteredRiads, setFilteredRiads] = useState([]);
  const [selectedRiadId, setSelectedRiadId] = useState(null);

  const { data: riads = {}, error, isLoading } = useQuery({
    queryKey: ['riads'],
    queryFn: fetchRiads
  });

  useEffect(() => {
    if (riads && Array.isArray(riads['hydra:member'])) {
      setFilteredRiads(riads['hydra:member'].filter(riad =>
        riad.name.toLowerCase().includes(search.toLowerCase())
      ));
    }
  }, [search, riads]);

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

  if (isLoading) return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );  
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <>
    <Navbar />
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-lg">
        <div className="text-lg font-semibold text-gray-900">
          Riads
        </div>
        <div className="flex items-center space-x-4">
          <input 
            className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-150 ease-in-out'
            type='text'
            placeholder='Search...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            onClick={() => openModal('modalAdd')}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Add
          </button>
          <ModalAdd />
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-700">A table of Riads.</p>

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
                          <ModalAdd />
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
