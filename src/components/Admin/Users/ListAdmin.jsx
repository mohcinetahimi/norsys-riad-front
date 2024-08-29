

// import React, { useContext, useState } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import axiosInstance from '../token/config';
// import { OpenContext } from '../../../contexts/OpenContext';
// import { useFlashMessage } from '../../../contexts/FlashMessageContext';
// import ModalAdd from '../../Modal/ModalAdd';
// import ModalEdit from '../../Modal/ModalEdit';
// import Navbar from '../Navbar/navbar';
// import axios from 'axios';
// import apiClient from '../token/config';
// import '../../../assets/style/loading.css';
// import DropdownMenu from '../Riad/DropdownMenu';

// // Fetch function
// const fetchUsers = async () => {
//   // const token = localStorage.getItem('token_admin');
  
//   // if (!token) {
//   //   throw new Error('No token found');
//   // }
  
//   const { data } = await apiClient.get('/users', {});
  
//   return data;
// };

// const UserTable = () => {
//   const { modals, openModal, closeModal } = useContext(OpenContext);
//   const { showFlashMessage } = useFlashMessage();
//   const queryClient = useQueryClient();
//   const [search, setSearch] = useState('');
//   const [dropdownOpen, setDropdownOpen] = useState(null);
//   const [selectedUserId, setSelectedUserId] = useState(null);

//   const { data: users = {}, error, isLoading } = useQuery({
//     queryKey: ['users'],
//     queryFn: fetchUsers
//   });

//   const deleteUser = async (id) => {
//     try {
//       await axiosInstance.delete(`/users/${id}`);
//       queryClient.invalidateQueries(['users']);
//       showFlashMessage('User deleted successfully!');
//     } catch (error) {
//       console.error("There was an error deleting the user!", error);
//       showFlashMessage('Failed to delete the user. Please try again.');
//     }
//   };

// const archiveUser = async (user) => {
//   try {
//     // Prepare the payload with the necessary user data
//     const payload = {
//       archived: true,
//       // Include other properties if necessary
//     };

//     // Make the PATCH request with the user ID and payload
//     await axiosInstance.patch(`/users/${user.id}/archive`, payload, {
//       headers: {
//         'Content-Type': 'application/merge-patch+json',
//         'Authorization': `Bearer ${localStorage.getItem('token_admin')}`,
//       }
//     });

//     // Invalidate queries to refresh the user list
//     queryClient.invalidateQueries(['users']);
//     showFlashMessage('User archived successfully!');
//   } catch (error) {
//     console.error("There was an error archiving the user!", error);
//     showFlashMessage('Failed to archive the user. Please try again.');
//   }
// };
// const activateUser = async (user) => {
//   try {
//     const payload = {
//       archived: false,
//     };

//     await axiosInstance.patch(`/users/${user.id}/activate`, payload, {
//       headers: {
//         'Content-Type': 'application/merge-patch+json',
//         'Authorization': `Bearer ${localStorage.getItem('token_admin')}`,
//       }
//     });

//     queryClient.invalidateQueries(['users']);
//     showFlashMessage('User activated successfully!');
//   } catch (error) {
//     console.error("There was an error activating the user!", error);
//     showFlashMessage('Failed to activate the user. Please try again.');
//   }
// };

  


//   const usersList = Array.isArray(users['hydra:member']) ? users['hydra:member'] : [];
//   // const filteredUsers = usersList.filter(user =>
//   //   user.email.toLowerCase().includes(search.toLowerCase()) ||
//   //   user.username.toLowerCase().includes(search.toLowerCase())
//   // );
//   const filteredUsers = usersList.filter(user =>
//   user.roles.includes('ROLE_ADMIN')&& (
//     user.email.toLowerCase().includes(search.toLowerCase()) ||
//     user.username.toLowerCase().includes(search.toLowerCase())
//   )
// );

//   const toggleDropdown = (id) => {
//     setDropdownOpen(dropdownOpen === id ? null : id);
//   };

//   if (isLoading) return (
//     <div className="spinner-container">
//       <div className="spinner"></div>
//       <div className="loading-text">Loading...</div>
//     </div>
//   );
//   if (error) return <div>Error loading data: {error.message}</div>;

//   return (
//     <div>
//       <Navbar />
//       <div className="px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-lg">
//           <div className="text-lg font-semibold text-gray-900">Users</div>
//           <div className="flex items-center space-x-4">
//             <input 
//               className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-150 ease-in-out'
//               type='text'
//               placeholder='Search...'
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <button
//               type="button"
//               onClick={() => openModal('modalAdd')}
//               className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
//             >
//               Add
//             </button>
//             <ModalAdd />
//           </div>
//         </div>

//         <div className="mt-8 flow-root">
//           <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//             <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//               {filteredUsers.length === 0 ? (
//                 <div className="text-center text-gray-500">No users found.</div>
//               ) : (
//                 <table className="min-w-full divide-y divide-gray-300">
//                   <thead>
//                     <tr>
//                       <th scope="col" className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">User ID</th>
//                       <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
//                       <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Username</th>
//                       <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Roles</th>
//                       <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Firstname</th>
//                       <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Secondname</th>
//                       <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">CIN</th>
//                       <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Address</th>
//                       <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Tele</th>
//                       <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200 bg-white">
//                     {filteredUsers.map((user) => (
//                       <React.Fragment key={user.id}>
//                         <tr>
//                           <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{user.id}</td>
//                           <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{user.email}</td>
//                           <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{user.username}</td>
//                           <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{user.roles.join(', ')}</td>
//                           <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{user.firstname}</td>
//                           <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{user.secondname}</td>
//                           <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{user.cin}</td>
//                           <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{user.address}</td>
//                           <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{user.tele}</td>
//                           <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
//                             <button
//                               onClick={() => toggleDropdown(user.id)}
//                               className="text-blue-600 hover:text-blue-900 ml-2"
//                               aria-label={`Open dropdown for Room ${user.id}`}
//                             >
//                               Options
//                             </button>
//                             {dropdownOpen === user.id && (
//                               <DropdownMenu
//                                 items={[
//                                   user.archived
//                                     ? { label: 'Activate', action: () => activateUser(user) }
//                                     : { label: 'Archive', action: () => archiveUser(user) },
//                                   { label: 'Edit', action: () => openModal(`modalEdit_${user.id}`) },
//                                   { label: 'Delete', action: () => deleteUser(user.id) },
                                  
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
//                         {modals[`modalEdit_${user.id}`] && <ModalEdit key={`modalEdit_${user.id}_${Date.now()}`} userId={user.id} defaultOpen={true} />}

//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserTable;






import React, { useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../token/config';
import { OpenContext } from '../../../contexts/OpenContext';
import { useFlashMessage } from '../../../contexts/FlashMessageContext';
import ModalAdd from '../../Modal/ModalAdd';
import ModalEdit from '../../Modal/ModalEdit';
import Navbar from '../Navbar/navbar';
import axios from 'axios';
import apiClient from '../token/config';
import '../../../assets/style/loading.css';
import DropdownMenu from '../Riad/DropdownMenu';
import PasswordModal from '../../Modal/ResetPasswordModal';
import '../../../assets/style/table.css'


// Fetch function
const fetchUsers = async () => {
  // const token = localStorage.getItem('token_admin');
  
  // if (!token) {
  //   throw new Error('No token found');
  // }
  
  const { data } = await apiClient.get('/users', {});
  
  return data;
};

const UserTable = () => {
  const { modals, openModal, closeModal } = useContext(OpenContext);
  const { showFlashMessage } = useFlashMessage();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false); // State for PasswordModal


  const { data: users = {}, error, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      queryClient.invalidateQueries(['users']);
      showFlashMessage('User deleted successfully!');
    } catch (error) {
      console.error("There was an error deleting the user!", error);
      showFlashMessage('Failed to delete the user. Please try again.');
    }
  };

const archiveUser = async (user) => {
  try {
    // Prepare the payload with the necessary user data
    const payload = {
      archived: true,
      // Include other properties if necessary
    };

    // Make the PATCH request with the user ID and payload
    await axiosInstance.patch(`/users/${user.id}/archive`, payload, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
        'Authorization': `Bearer ${localStorage.getItem('token_admin')}`,
      }
    });

    // Invalidate queries to refresh the user list
    queryClient.invalidateQueries(['users']);
    showFlashMessage('User archived successfully!');
  } catch (error) {
    console.error("There was an error archiving the user!", error);
    showFlashMessage('Failed to archive the user. Please try again.');
  }
};
const activateUser = async (user) => {
  try {
    const payload = {
      archived: false,
    };

    await axiosInstance.patch(`/users/${user.id}/activate`, payload, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
        'Authorization': `Bearer ${localStorage.getItem('token_admin')}`,
      }
    });

    queryClient.invalidateQueries(['users']);
    showFlashMessage('User activated successfully!');
  } catch (error) {
    console.error("There was an error activating the user!", error);
    showFlashMessage('Failed to activate the user. Please try again.');
  }
};

const handlePasswordModal = (id) => {
  console.log('Reset password modal triggered for user:', id);
  setSelectedUserId(id);
  setPasswordModalOpen(true);
};


  const usersList = Array.isArray(users['hydra:member']) ? users['hydra:member'] : [];
  // const filteredUsers = usersList.filter(user =>
  //   user.email.toLowerCase().includes(search.toLowerCase()) ||
  //   user.username.toLowerCase().includes(search.toLowerCase())
  // );
  const filteredUsers = usersList.filter(user =>
  user.roles.includes('ROLE_ADMIN')&& (
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase())
  )
);
const handleDropdownSelect = (item) => {
  if (typeof item.action === 'function') {
    item.action();
  }
  setDropdownOpen(null); // Close the dropdown after an action
};


  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  if (isLoading) return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div>
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">Users</div>
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

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {filteredUsers.length === 0 ? (
                <div className="text-center text-gray-500">No users found.</div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">User ID</th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Username</th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Roles</th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Firstname</th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Secondname</th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">CIN</th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Address</th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Tele</th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  {/* <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredUsers.map((user) => (
                      <React.Fragment key={user.id}>
                        <tr>
                        <td data-label="User ID"><span>{user.id}</span></td>
                      <td data-label="Email"><span>{user.email}</span></td>
                      <td data-label="Username"><span>{user.username}</span></td>
                      <td data-label="Roles"><span>{user.roles.join(', ')}</span></td>
                      <td data-label="Firstname"><span>{user.firstname}</span></td>
                      <td data-label="Secondname"><span>{user.secondname}</span></td>
                      <td data-label="CIN"><span>{user.cin}</span></td>
                      <td data-label="Address"><span>{user.address}</span></td>
                      <td data-label="Tele"><span>{user.tele}</span></td>
                      <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <button
                              onClick={() => handlePasswordModal(user.id)}
                              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                            >
                              Reset Password
                            </button>
                            <button
                              onClick={() => toggleDropdown(user.id)}
                              className="text-blue-600 hover:text-blue-900 ml-2"
                              aria-label={`Open dropdown for Room ${user.id}`}
                            >
                              Options
                            </button>
                            {dropdownOpen === user.id && (
                              <DropdownMenu
                                items={[
                                  user.archived
                                    ? { label: 'Activate', action: () => activateUser(user) }
                                    : { label: 'Archive', action: () => archiveUser(user) },
                                  { label: 'Edit', action: () => openModal(`modalEdit_${user.id}`) },
                                  { label: 'Delete', action: () => deleteUser(user.id) },
                                  
                                ]}
                                onSelect={handleDropdownSelect}

                              />
                            )}
                      </td>
                        </tr>
                        {modals[`modalEdit_${user.id}`] && <ModalEdit key={`modalEdit_${user.id}_${Date.now()}`} userId={user.id} defaultOpen={true} />}

                      </React.Fragment>
                    ))}
                  </tbody> */}
                  <tbody className="divide-y divide-gray-200 bg-white">
  {filteredUsers.map((user, index) => (
    <React.Fragment key={user.id}>
      <tr
        className={index === filteredUsers.length - 1 ? 'highlighted-row' : ''}
      >
        <td data-label="User ID"><span>{user.id}</span></td>
        <td data-label="Email"><span>{user.email}</span></td>
        <td data-label="Username"><span>{user.username}</span></td>
        <td data-label="Roles"><span>{user.roles.join(', ')}</span></td>
        <td data-label="Firstname"><span>{user.firstname}</span></td>
        <td data-label="Secondname"><span>{user.secondname}</span></td>
        <td data-label="CIN"><span>{user.cin}</span></td>
        <td data-label="Address"><span>{user.address}</span></td>
        <td data-label="Tele"><span>{user.tele}</span></td>
        <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          {/* <button
            onClick={() => handlePasswordModal(user.id)}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Reset Password
          </button>
           */}
           <button
  onClick={() => handlePasswordModal(user.id)}
  className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
>
  Reset Password
</button>

          <button
            onClick={() => toggleDropdown(user.id)}
            className="text-blue-600 hover:text-blue-900 ml-2"
            aria-label={`Open dropdown for Room ${user.id}`}
          >
            Options
          </button>
          {dropdownOpen === user.id && (
            <DropdownMenu
              items={[
                user.archived
                  ? { label: 'Activate', action: () => activateUser(user) }
                  : { label: 'Archive', action: () => archiveUser(user) },
                { label: 'Edit', action: () => openModal(`modalEdit_${user.id}`) },
                { label: 'Delete', action: () => deleteUser(user.id) },
              ]}
              onSelect={handleDropdownSelect}
            />
          )}
        </td>
      </tr>
      {modals[`modalEdit_${user.id}`] && <ModalEdit key={`modalEdit_${user.id}_${Date.now()}`} userId={user.id} defaultOpen={true} />}
    </React.Fragment>
  ))}
</tbody>

                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      {passwordModalOpen &&
       <PasswordModal userId={selectedUserId}       isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)} />}

    </div>
  );
};

export default UserTable;




















