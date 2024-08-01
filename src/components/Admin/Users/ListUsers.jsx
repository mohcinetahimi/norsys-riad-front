import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../pages/navbar';
import { useNavigate } from 'react-router-dom';

const ListUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token_admin');
    
                if (!token) {
                    navigate('/Admin');
                    return;
                }

                const meResponse = await axios.get('http://localhost:8000/api/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (meResponse.status === 200) {
                    const loggedInUser = meResponse.data;

                    const response = await axios.get('http://localhost:8000/api/users', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });

                    if (response.data['hydra:member'] && Array.isArray(response.data['hydra:member'])) {
                        const filteredUsers = response.data['hydra:member'].filter(user => user.id !== loggedInUser.id);
                        setUsers(filteredUsers);
                    } else {
                        throw new Error('Unexpected response format');
                    }
                } else {
                    navigate('/Admin');
                }
                setLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate('/Admin');
                } else {
                    setError(err);
                }
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleEdit = (userId) => {
        navigate(`/edit-user/${userId}`);
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token_admin');
    
            if (!token) {
                navigate('/Admin');
                return;
            }

            await axios.delete(`http://localhost:8000/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            if (err.response && err.response.status === 401) {
                navigate('/Admin');
            } else {
                setError(err);
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <>
            <Navbar />
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Username
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => navigate(`/users/${user.id}`)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => handleEdit(user.id)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListUsers;
