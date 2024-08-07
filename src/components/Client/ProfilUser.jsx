import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import userImage from '../../assets/Admin.jpg'; // Path to default image
import Navbar from '../../components/Riad/Navbar';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import TrashIcon
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        firstName: '',
        lastName: '',
        Cin: '',
        address: '',
        telephone: '',
        imageUrl: '' // Initialize as an empty string
    });
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate(); // Hook for programmatic navigation

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get('http://localhost:8000/api/user_info', {
                    params: { token },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                setUser({
                    id: response.data.id, // Set the user ID
                    name: `${response.data.firstname || 'Unknown'} ${response.data.lastname || ''}`,
                    email: response.data.email || 'example@example.com',
                    firstName: response.data.firstname || 'No first name',
                    lastName: response.data.lastname || 'No last name',
                    Cin: response.data.Cin || 'No CIN',
                    address: response.data.adresse || 'No address',
                    telephone: response.data.Telephone || 'No telephone',
                    imageUrl: response.data.image_url ? response.data.image_url : '' // Use image URL from response if available, otherwise empty
                });
            } else {
                // Redirect to login if no token found
                navigate('/login');
            }
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            // Redirect to login on error
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleImageUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:8000/api/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.fileUrl) {
                fetchUserInfo(); // Fetch the latest user info after upload to update image URL
                setMenuVisible(false); // Hide the menu after upload
            } else {
                console.error('Response does not contain fileUrl:', response.data);
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
        }
    };

    const handleImageDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/delete-image/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 204) {
                fetchUserInfo(); // Fetch the latest user info after delete to update image URL
                setMenuVisible(false); // Hide the menu after delete
            } else {
                console.error('Failed to delete image:', response.data);
            }
        } catch (error) {
            console.error('Failed to delete image:', error);
        }
    };

    const handleImageClick = () => {
        setMenuVisible(!menuVisible);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="pt-20 max-w-4xl mx-auto p-4">
                {user.id ? (
                    <div className="relative flex items-center space-x-4">
                        <div className="relative">
                            <img
                                className="h-24 w-24 rounded-full cursor-pointer"
                                src={user.imageUrl ? `http://localhost:8000${user.imageUrl}` : userImage}
                                alt={user.name}
                                onClick={handleImageClick}
                            />
                            {menuVisible && (
                                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-300 w-40">
                                    <button
                                        className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 w-full text-left"
                                        onClick={handleImageUploadClick}
                                    >
                                        <PhotoIcon className="h-5 w-5 mr-2" />
                                        Upload
                                    </button>
                                    <button
                                        className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 w-full text-left"
                                        onClick={handleImageDelete}
                                    >
                                        <TrashIcon className="h-5 w-5 mr-2" />
                                        Delete
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold">{user.name}</h1>
                            <p className="text-lg text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-500">First Name: {user.firstName}</p>
                            <p className="text-sm text-gray-500">Last Name: {user.lastName}</p>
                            <p className="text-sm text-gray-500">CIN: {user.Cin}</p>
                            <p className="text-sm text-gray-500">Address: {user.address}</p>
                            <p className="text-sm text-gray-500">Telephone: {user.telephone}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <p>You are not authenticated. Please <a href="/login" className="text-blue-500 hover:underline">login</a> to access your profile.</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProfilePage;
