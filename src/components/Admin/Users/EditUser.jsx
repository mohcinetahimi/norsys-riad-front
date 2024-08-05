import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../pages/navbar';

const EditUser = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState([]);
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [initialValues, setInitialValues] = useState({});
    const [flashMessage, setFlashMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token_admin');
                if (!token) {
                    navigate('/admin');
                    return;
                }

                // Fetch user data from the API
                const response = await axios.get(`http://localhost:8000/api/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                const userData = response.data;
                setUser(userData);

                // Set state variables with fetched user data
                setUsername(userData.username);
                setEmail(userData.email);
                setRoles(userData.roles);
                setFirstName(userData.firstname || ''); // Ensure default value if undefined
                setLastName(userData.secondname || '');   // Ensure default value if undefined
                setPhoneNumber(userData.tele || ''); // Ensure default value if undefined
                setAddress(userData.address || '');     // Ensure default value if undefined

                // Set initial values for comparison when saving changes
                setInitialValues({
                    username: userData.username,
                    email: userData.email,
                    roles: userData.roles,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    phoneNumber: userData.phoneNumber || '',
                    address: userData.address || '',
                    password: '',
                });

                setLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate('/admin');
                } else {
                    setError(err);
                }
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updates = {};
        if (username !== initialValues.username) updates.username = username;
        if (email !== initialValues.email) updates.email = email;
        if (roles.join(', ') !== initialValues.roles.join(', ')) updates.roles = roles;
        if (firstName !== initialValues.firstName) updates.firstName = firstName;
        if (lastName !== initialValues.lastName) updates.lastName = lastName;
        if (phoneNumber !== initialValues.phoneNumber) updates.phoneNumber = phoneNumber;
        if (address !== initialValues.address) updates.address = address;
        if (password) updates.password = password;

        if (Object.keys(updates).length === 0) {
            setFlashMessage('No changes detected.');
            setTimeout(() => setFlashMessage(''), 2000);
            return;
        }

        try {
            const token = localStorage.getItem('token_admin');
            if (!token) {
                navigate('/Admin');
                return;
            }

            await axios.put(`http://localhost:8000/api/users/${userId}`, updates, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setFlashMessage('User data updated successfully!');
            setInitialValues({ ...initialValues, ...updates });

            setTimeout(() => {
                setFlashMessage('');
                navigate('/ListUsers');
            }, 2000);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                navigate('/Admin');
            } else {
                setError(err);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!user) return <p>User not found</p>;

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Edit User</h1>
                {flashMessage && <div className="mb-4 p-4 text-white bg-green-600 rounded-md">{flashMessage}</div>}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <form onSubmit={handleSubmit}>
                        {/* Username Field */}
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        {/* Roles Field */}
                        <div className="mb-4">
                            <label htmlFor="roles" className="block text-sm font-medium text-gray-700">Roles</label>
                            <input
                                id="roles"
                                type="text"
                                value={roles.join(', ')}
                                onChange={(e) => setRoles(e.target.value.split(',').map(role => role.trim()))}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        {/* First Name Field */}
                        <div className="mb-4">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        {/* Last Name Field */}
                        <div className="mb-4">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        {/* Phone Number Field */}
                        <div className="mb-4">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                id="phoneNumber"
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        {/* Address Field */}
                        <div className="mb-4">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                id="address"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditUser;
