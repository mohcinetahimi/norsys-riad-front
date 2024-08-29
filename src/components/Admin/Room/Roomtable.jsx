// import React, { useContext, useState, useEffect } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import axiosInstance from '../token/config';
// import { OpenContext } from '../../../contexts/OpenContext';
// import { useFlashMessage } from '../../../contexts/FlashMessageContext';
// import ModalAdd from '../../Modal/ModalAdd';
// import ModalEdit from '../../Modal/ModalEdit';
// import ModalImages from '../../Modal/ModalImages';
// import DropdownMenu from '../Riad/DropdownMenu';
// import Navbar from '../Navbar/navbar';
// import '../../../assets/style/loading.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // Fetch rooms data
// const fetchRooms = async () => {
//   const { data } = await axiosInstance.get('/rooms');
//   return data;
// };

// const RoomTable = () => {
//   const { modals, openModal, closeModal } = useContext(OpenContext);
//   const { showFlashMessage } = useFlashMessage();
//   const queryClient = useQueryClient();
//   const [search, setSearch] = useState('');
//   const [filteredRooms, setFilteredRooms] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(null);

//   const { data: rooms = {}, error, isLoading } = useQuery({
//     queryKey: ['rooms'],
//     queryFn: fetchRooms
//   });

//   useEffect(() => {
//     if (Array.isArray(rooms['hydra:member'])) {
//       setFilteredRooms(rooms['hydra:member'].filter(room =>
//         room.name.toLowerCase().includes(search.toLowerCase())
//       ));
//     }
//   }, [search, rooms]);

//   const deleteRoom = async (id) => {
//     try {
//       await axiosInstance.delete(`/rooms/${id}`);
//       queryClient.invalidateQueries(['rooms']);
//       showFlashMessage('Room deleted successfully!');
//     } catch (error) {
//       console.error("Error deleting the room:", error);
//       showFlashMessage('Failed to delete the room. Please try again.');
//     }
//   };

//   const toggleDropdown = (id) => {
//     setDropdownOpen(dropdownOpen === id ? null : id);
//   };
//   const extractIdFromUrl = (url) => {
//   const parts = url.split('/');
//   return parts[parts.length - 1];
// };

//   if (isLoading) return (
//     <div className="spinner-container">
//       <div className="spinner"></div>
//       <div className="loading-text">Loading...</div>
//     </div>
//   );  
//   if (error) return <div className="error-message">Error loading data: {error.message}</div>;

//   return (
//     <>
//       <Navbar />
//       <div className="px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-lg">
//           <div className="text-lg font-semibold text-gray-900">Rooms</div>
//           <div className="flex items-center space-x-4">
//             <input 
//               className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-150 ease-in-out'
//               type='text'
//               placeholder='Search...'
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
            
//           </div>
//         </div>
//         <div className="mt-8 flow-root">
//           <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//             <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//               {filteredRooms.length === 0 ? (
//                 <div className="text-center text-gray-500">No Rooms found.</div>
//               ) : (
//                 <table className="min-w-full divide-y divide-gray-300">
//                   <thead>
//                     <tr>
//                       <th className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Room ID</th>
//                       <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
//                       <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
//                       <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Number of Persons</th>
//                       <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
//                       <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200 bg-white">
//                     {filteredRooms.map((room) => (
                      
//                       <React.Fragment key={room.id}>
//                         <tr>
//                           <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{room.id}</td>
//                           <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{room.name}</td>
//                           <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{room.description}</td>
//                           <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{room.nb_personne}</td>
//                           <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">${room.price.toFixed(2)}</td>
//                           <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
//                             <button
//                               onClick={() => toggleDropdown(room.id)}
//                               className="text-blue-600 hover:text-blue-900 ml-2"
//                               aria-label={`Open dropdown for Room ${room.id}`}
//                             >
//                               Options
//                             </button>
//                             {dropdownOpen === room.id && (
                             
//                               <DropdownMenu
//                                 items={[
//                                   { label: 'Edit', action: () => openModal(`modalEdit_${room.id}`) },
//                                   { label: 'Delete', action: () => deleteRoom(room.id) },
//                                   { label: 'View Room Images', action: () => openModal(`modalImages_${room.id}`) }
//                                 ]}
//                                 onSelect={(item) => {
//                                   if (typeof item.action === 'function') {
//                                     item.action();
//                                   } else {
//                                     console.error('Expected item.action to be a function but got', typeof item.action);
//                                   }
//                                 }}
//                               />

//                             )}
//                           </td>
//                         </tr>
//                         {modals[`modalEdit_${room.id}`] && <ModalEdit key={`modalEdit_${room.id}_${Date.now()}`} roomId={room.id} defaultOpen={true} />}
//                         {modals[`modalImages_${room.id}`] && <ModalImages roomId={extractIdFromUrl(room["@id"])}/>} 
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RoomTable;
import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../token/config';
import { OpenContext } from '../../../contexts/OpenContext';
import { useFlashMessage } from '../../../contexts/FlashMessageContext';
import ModalAdd from '../../Modal/ModalAdd';
import ModalEdit from '../../Modal/ModalEdit';
import ModalImages from '../../Modal/ModalImages';
import DropdownMenu from '../Riad/DropdownMenu';
import Navbar from '../Navbar/navbar';
import ConfirmationModal from '../../../contexts/ConfirmationModal';
import '../../../assets/style/loading.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Fetch rooms data
const fetchRooms = async () => {
  const { data } = await axiosInstance.get('/rooms');
  return data;
};

const RoomTable = () => {
  const { modals, openModal, closeModal } = useContext(OpenContext);
  const { showFlashMessage } = useFlashMessage();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const { data: rooms = {}, error, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms
  });

  useEffect(() => {
    if (Array.isArray(rooms['hydra:member'])) {
      setFilteredRooms(rooms['hydra:member'].filter(room =>
        room.name.toLowerCase().includes(search.toLowerCase())
      ));
    }
  }, [search, rooms]);

  const deleteRoom = (id) => {
    setRoomToDelete(id);
    openModal('confirmationModal');
  };

  const handleConfirmDelete = async () => {
    if (roomToDelete) {
      try {
        await axiosInstance.delete(`/rooms/${roomToDelete}`);
        queryClient.invalidateQueries(['rooms']);
        showFlashMessage('Room deleted successfully!');
      } catch (error) {
        console.error("Error deleting the room:", error);
        showFlashMessage('Failed to delete the room. Please try again.');
      }
      setRoomToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setRoomToDelete(null);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
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
  if (error) return <div className="error-message">Error loading data: {error.message}</div>;

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">Rooms</div>
          <div className="flex items-center space-x-4">
            <input 
              className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-150 ease-in-out'
              type='text'
              placeholder='Search...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {filteredRooms.length === 0 ? (
                <div className="text-center text-gray-500">No Rooms found.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Room ID</th>
                      <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                      <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Number of Persons</th>
                      <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                      <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredRooms.map((room) => (
                      <React.Fragment key={room.id}>
                        <tr>
                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{room.id}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{room.name}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{room.description}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{room.nb_personne}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">${room.price.toFixed(2)}</td>
                          <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <button
                              onClick={() => toggleDropdown(room.id)}
                              className="text-blue-600 hover:text-blue-900 ml-2"
                              aria-label={`Open dropdown for Room ${room.id}`}
                            >
                              Options
                            </button>
                            {dropdownOpen === room.id && (
                              <DropdownMenu
                                items={[
                                  { label: 'Edit', action: () => openModal(`modalEdit_${room.id}`) },
                                  { label: 'Delete', action: () => deleteRoom(room.id) },
                                  { label: 'View Room Images', action: () => openModal(`modalImages_${room.id}`) }
                                ]}
                                onSelect={(item) => {
                                  item.action();
                                  toggleDropdown(null); // Close the dropdown
                                }}
                              />
                            )}
                          </td>
                        </tr>
                        {modals[`modalEdit_${room.id}`] && <ModalEdit key={`modalEdit_${room.id}_${Date.now()}`} roomId={room.id} defaultOpen={true} />}
                        {modals[`modalImages_${room.id}`] && <ModalImages roomId={extractIdFromUrl(room["@id"])}/>}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      {modals['confirmationModal'] && (
        <ConfirmationModal
          message="Are you sure you want to delete this room?"
          onConfirm={() => handleConfirmDelete()} // Pass as a function reference
          onCancel={handleCancelDelete}
        />
      )}  
    </>
  );
};

export default RoomTable;
