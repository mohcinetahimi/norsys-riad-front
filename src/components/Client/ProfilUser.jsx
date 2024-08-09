import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../Admin/token/configUser'; // Adjust import path as needed
import userImage from '../../assets/Admin.jpg'; // Path to default image
import Navbar from '../../components/Riad/Navbar';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import TrashIcon
import { useNavigate } from 'react-router-dom';
import { useFlashMessage } from '../../contexts/FlashMessageContext'; // Adjust import path as needed
import '../../assets/style/loading.css';    
import axios from 'axios';

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
    const flashMessage = useFlashMessage(); // Hook for flash messages

    useEffect(() => {
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
                    console.log(response.data);
                    setUser({
                        id: response.data.id,
                        name: `${response.data.firstname || 'Unknown'} ${response.data.lastname || ''}`,
                        email: response.data.email || 'example@example.com',
                        firstName: response.data.firstname || 'No first name',
                        lastName: response.data.lastname || 'No last name',
                        Cin: response.data.Cin || 'No CIN',
                        address: response.data.adresse || 'No address',
                        telephone: response.data.Telephone || 'No telephone',
                        imageUrl: response.data.image_url || userImage, // Use image URL from response if available
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            } finally {
                setLoading(false);
            }
        };

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
            const response = await apiClient.post('/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.fileUrl) {
                
                setMenuVisible(false); // Hide the menu after upload
                window.location.reload();
            } else {
                console.error('Response does not contain fileUrl:', response.data);
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
        }
    };

    const handleImageDelete = async () => {
        try {
            const response = await apiClient.delete(`/delete-image/${user.id}`);

            if (response.status === 204) {
                
                setMenuVisible(false); // Hide the menu after delete
                window.location.reload();
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

    if (loading) return (
        <div className="spinner-container">
            <div className="spinner"></div>
            <div className="loading-text">Loading...</div>
        </div>
    );

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
