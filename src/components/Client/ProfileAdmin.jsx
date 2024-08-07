import React, { useState, useEffect } from 'react';
import axios from 'axios';
import userImage from '../../assets/Admin.jpg'; // Path to default image
import Navbar from '../Admin/Navbar/navbar';

function ProfilePage() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        firstName: '',
        lastName: '',
        Cin: '',
        address: '',
        telephone: '',
        imageUrl: userImage // Default image
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token_admin');
                if (token) {
                    const response = await axios.get('http://localhost:8000/api/user_info', {
                        params: { token },
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    setUser({
                        name: `${response.data.firstname || 'Unknown'} ${response.data.lastname || ''}`,
                        email: response.data.email || 'example@example.com',
                        firstName: response.data.firstname || 'No first name',
                        lastName: response.data.lastname || 'No last name',
                        Cin: response.data.Cin || 'No CIN',
                        address: response.data.adresse || 'No address',
                        telephone: response.data.Telephone || 'No telephone',
                        imageUrl: response.data.imageUrl || userImage, // Use image URL from response if available
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

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto p-4">
                <div className="flex items-center space-x-4">
                    <img className="h-24 w-24 rounded-full" src={user.imageUrl} alt={user.name} />
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
            </div>
        </>
    );
}

export default ProfilePage;
