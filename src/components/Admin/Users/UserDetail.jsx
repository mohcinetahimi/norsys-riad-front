import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/navbar';

const UserDetail = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token_admin');
    
                if (!token) {
                    navigate('/Admin');
                    return;
                }

                const response = await axios.get(`http://localhost:8000/api/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                setUser(response.data);
                setLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                } else {
                    setError(err);
                }
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, navigate]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    if (!user) {
        return <p>User not found</p>;
    }

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">User Details</h1>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Roles:</strong> {user.roles.join(', ')}</p>
                    <p><strong>First Name:</strong> {user.firstname}</p>
                    <p><strong>Second Name:</strong> {user.secondname}</p>
                    <p><strong>CIN:</strong> {user.cin}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <p><strong>Telephone:</strong> {user.tele}</p>
                    <p><strong>Last Password Changed At:</strong> {user.lastPasswordChangedAt ? new Date(user.lastPasswordChangedAt).toLocaleString() : 'Not changed'}</p>
                    {/* Add more user details here as needed */}
                </div>
            </div>
        </>
    );
};

export default UserDetail;
