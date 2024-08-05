import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/navbar';

const ListRooms = () => {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                // Replace 'your_token_key' with the key you use to store the token
                const token = localStorage.getItem('token_admin');

                if (!token) {
                    console.error('No token found');
                    return;
                }

                const response = await axios.get('http://localhost:8000/api/rooms', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Ensure the response data is an array
                setRooms(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching rooms:', error);
                // Handle errors such as showing a message to the user
                setRooms([]); // Ensure rooms is an empty array on error
            }
        };

        fetchRooms();
    }, []);

    const handleAddRoom = () => {
        navigate('/addRoom'); // Replace with your actual route
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold">Rooms List</h1>
                <button 
                    onClick={handleAddRoom} 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Room
                </button>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4">
                {rooms.length > 0 ? (
                    rooms.map(room => (
                        <div key={room.id} className="bg-gray-200 p-4 rounded shadow">
                            <h2 className="text-lg font-bold">{room.name}</h2>
                            <p>{room.description}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-span-3">No rooms found</p>
                )}
            </div>
        </>
    );
};

export default ListRooms;
