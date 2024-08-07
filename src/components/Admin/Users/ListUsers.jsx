import React, { useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../token/config';
import { OpenContext } from '../../../contexts/OpenContext';
import { useFlashMessage } from '../../../contexts/FlashMessageContext';
import ModalAdd from '../../Modal/ModalAdd';
import ModalEdit from '../../Modal/ModalEdit';
import Navbar from '../../Navbar/navbar'; 
import axios from 'axios';
import '../../../assets/style/loading.css';

// Fetch function
const fetchUsers = async () => {
  const token = localStorage.getItem('token_admin');
  
  if (!token) {
    throw new Error('No token found');
  }
  
  const { data } = await axios.get('http://localhost:8000/api/users', {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
  
  return data;
};

const UserTable = () => {
  const { modals, openModal, closeModal } = useContext(OpenContext);
  const { showFlashMessage } = useFlashMessage();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

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

  const usersList = Array.isArray(users['hydra:member']) ? users['hydra:member'] : [];
  const filteredUsers = usersList.filter(user =>
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div>
      <Navbar /> {/* Add Navbar here */}
      <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-lg">
        <div className="text-lg font-semibold text-gray-900">
          Users
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

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {filteredUsers.length === 0 ? (
                <div className="text-center text-gray-500">No users found.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        User ID
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Username
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Roles
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Firstname
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Secondname
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        CIN
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Address
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Tele
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredUsers.map((user) => (
                      <React.Fragment key={user.id}>
                        <tr>
                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{user.id}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{user.email}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{user.username}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{user.roles.join(', ')}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{user.firstname}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{user.secondname}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{user.cin}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{user.address}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{user.tele}</td>
                          <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <ModalEdit userId={user.id} />
                            <button
                              type="button"
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 ml-2"
                              aria-label={`Delete User ${user.id}`}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
