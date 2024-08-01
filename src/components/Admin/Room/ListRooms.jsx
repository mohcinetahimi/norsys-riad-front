import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../pages/navbar';

const ListRooms = () => {
    const [rooms, setRooms] = useState([]);

    const staticData = [
        { id: 1, name: "Room 1", description: "This is room 1" },
        { id: 2, name: "Room 2", description: "This is room 2" },
        { id: 3, name: "Room 3", description: "This is room 3" }
    ];
    useEffect(() => {
        setRooms(staticData);
    }, []);

    return (
        <>
            <Navbar />
            <div className="grid grid-cols-3 gap-4">
            {rooms.map(room => (
                <div key={room.id} className="bg-gray-200 p-4">
                    <h2 className="text-lg font-bold">{room.name}</h2>
                    <p>{room.description}</p>
                </div>
            ))}
            </div>
        </>
    );

    
};

export default ListRooms;