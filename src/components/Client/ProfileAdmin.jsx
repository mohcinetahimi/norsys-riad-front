import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../Admin/token/config'; // Adjust import path as needed
import userImage from '../../assets/Admin.jpg'; // Path to default image
import Navbar from '../Admin/Navbar/navbar';
import { PhotoIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useFlashMessage } from '../../contexts/FlashMessageContext'; // Adjust import path as needed
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet'; // Import Leaflet library for custom marker icons


import '../../assets/style/loading.css';    
import axios from 'axios';

function ProfilePage() {
    const [user, setUser] = useState({
        id: '',
        username:'',
        name: '',
        email: '',
        firstName: '',
        lastName: '',
        Cin: '',
        address: '',
        telephone: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [isEditing, setIsEditing] = useState({});
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token_admin');
                if (token) {
                    const response = await apiClient.get('http://localhost:8000/api/user_info', {
                        params: { token },
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    console.log(response.data);
                    setUser({
                        id: response.data.id,
                        username : response.data.username,
                        name: `${response.data.firstname || 'Unknown'} ${response.data.lastname || ''}`,
                        email: response.data.email || 'example@example.com',
                        firstname: response.data.firstname || 'No first name',
                        secondname: response.data.lastname || 'No last name',
                        cin: response.data.cin || 'No CIN',
                        address: response.data.adresse || 'No address',
                        tele: response.data.Telephone || 'No telephone',
                        imageUrl: response.data.image_url || '',
                        password: response.data.password || '',
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


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error('Error fetching location:', error);
                    // Handle error (e.g., show a message or fallback)
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            // Handle case when Geolocation is not supported
    }
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
                setUser(prevUser => ({
                    ...prevUser,
                    imageUrl: response.data.fileUrl
                }));
                setMenuVisible(false);
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
                setUser(prevUser => ({
                    ...prevUser,
                    imageUrl: ''
                }));
                setMenuVisible(false);
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

    const handleEditClick = (field) => {
        setIsEditing({ ...isEditing, [field]: true });
    };

    const handleSaveClick = async (field) => {
        try {
            const response = await apiClient.put(`/users/${user.id}`,  user );

            if (response.status === 200) {
                setIsEditing(prevEditing => ({ ...prevEditing, [field]: false }));
            } else {
                console.error('Failed to update user:', response.data);
            }
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const renderEditableField = (field, label) => (
        <div className="flex flex-col py-3">
            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">{label}</dt>
            <dd className="text-lg font-semibold">
                {isEditing[field] ? (
                    <>
                        <input
                            type="text"
                            name={field}
                            value={user[field]}
                            onChange={handleInputChange}
                            className="border p-1 rounded"
                        />
                        <button onClick={() => handleSaveClick(field)} className="ml-2 p-1 bg-green-500 text-white rounded">
                            Save
                        </button>
                        <button onClick={() => setIsEditing(prevEditing => ({ ...prevEditing, [field]: false }))}
                            className="ml-2 p-1 bg-red-500 text-white rounded">
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        {user[field]}
                        <button onClick={() => handleEditClick(field)} className="ml-2 p-1 bg-blue-500 text-white rounded">
                            <PencilIcon className="w-5 h-5" />
                        </button>
                    </>
                )}
            </dd>
        </div>
    );

    

    return (
        <>
            <Navbar />
            <section className="w-full overflow-hidden dark:bg-gray-900">
                <div className="flex flex-col">
                    {/* Cover Image */}
                    <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw5fHxjb3ZlcnxlbnwwfDB8fHwxNzEwNzQxNzY0fDA&ixlib=rb-4.0.3&q=80&w=1080" alt="User Cover"
                        className="w-full xl:h-[20rem] lg:h-[18rem] md:h-[16rem] sm:h-[14rem] xs:h-[11rem]" />

                    {/* Profile Image */}
                    <div className="sm:w-[80%] xs:w-[90%] mx-auto flex">
                    <img
    src={user.imageUrl ? `http://localhost:8000/${user.imageUrl}` : userImage}
    alt="User Profile"
    className="rounded-md lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-blue-500 relative lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]"
    onClick={handleImageClick}
/>
                        {menuVisible && (
                            <div className="absolute bottom- left-20 flex flex-col bg-white shadow-lg p-2 rounded">
                                <button onClick={handleImageUploadClick} className="p-1 mb-2 bg-blue-500 text-white rounded">
                                    <PhotoIcon className="w-5 h-5" />
                                </button>
                                <button onClick={handleImageDelete} className="p-1 bg-red-500 text-white rounded">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        )}
                        <h1 className="w-full text-left my-4 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif">
                            {user.name}
                        </h1>
                    </div>

                    <div className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
{/*                        
                        <p className="w-fit text-gray-700 dark:text-gray-400 text-md">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam debitis labore consectetur voluptatibus mollitia dolorem veniam omnis ut quibusdam minima sapiente repellendus asperiores explicabo, eligendi odit, dolore similique fugiat dolor, doloremque eveniet. Odit, consequatur. Ratione voluptate exercitationem hic eligendi vitae animi nam in, est earum culpa illum aliquam.
                        </p> */}

                        {/* Detail */}
                        <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
                            <div className="w-full flex sm:flex-row xs:flex-col gap-2 justify-center">
                                <div className="w-full">
                                    <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                                        {renderEditableField('firstname', 'First Name')}
                                        {renderEditableField('email', 'Email')}
                                        {renderEditableField('secondname', 'Last Name')}
                                        {renderEditableField('cin', 'CIN')}
                                        {renderEditableField('address', 'Address')}
                                        {renderEditableField('tele', 'Telephone')}
                                    </dl>
                                </div>
                            </div>

                            <div className="mt-8">
                               {latitude && longitude ? (
                                <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '400px', width: '100%' }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={[latitude, longitude]}>
                                            <Popup>Your current location</Popup>
                                        </Marker>
                                    </MapContainer>
                                ) : (
                                    <p>Location data not available.</p>
                                )}
                            </div>
                        </div>

                        {/* Social Links */}
                        {/* <div className="fixed right-2 bottom-20 flex flex-col rounded-sm bg-gray-200 text-gray-500 dark:bg-gray-200/80 dark:text-gray-700 hover:text-gray-600 hover:dark:text-gray-400">
                            <a href="https://www.linkedin.com/in/samuel-abera-6593a2209/">
                                <div className="p-2 hover:text-primary hover:dark:text-primary">
                                    <svg className="lg:w-6 lg:h-6 xs:w-4 xs:h-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" />
                                        <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                                    </svg>
                                </div>
                            </a>
                          
                        </div> */}
                    </div>
                </div>
            </section>
        </>
    );
}

export default ProfilePage;
