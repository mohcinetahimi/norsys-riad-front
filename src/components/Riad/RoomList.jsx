import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import axios from 'axios';
import ReservationForm from '../Profil/ReservationForm.jsx'; // Adjust the path as necessary

const BASE_URL = 'http://localhost:8000';

export default function RoomList({ rooms }) {
    const [selectedRoom, setSelectedRoom] = useState(rooms[0] || null);
    const [roomImages, setRoomImages] = useState({});
    const [activeImageIndex, setActiveImageIndex] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);

    const fetchRoomImages = async (roomId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/rooms/${roomId}`);
            const images = response.data.images;
            setRoomImages(prevImages => ({ ...prevImages, [roomId]: images }));
            setActiveImageIndex(prevState => ({ ...prevState, [roomId]: 0 }));
        } catch (error) {
            console.error('Error fetching room images:', error);
        }
    };

    useEffect(() => {
        if (rooms.length > 0) {
            rooms.forEach(room => {
                fetchRoomImages(room.id);
            });
        }
    }, [rooms]);

    const handlePrev = (roomId) => {
        setActiveImageIndex(prevState => {
            const currentIndex = prevState[roomId] || 0;
            const images = roomImages[roomId] || [];
            const newIndex = (currentIndex === 0 ? images.length - 1 : currentIndex - 1);
            return { ...prevState, [roomId]: newIndex };
        });
    };

    const handleNext = (roomId) => {
        setActiveImageIndex(prevState => {
            const currentIndex = prevState[roomId] || 0;
            const images = roomImages[roomId] || [];
            const newIndex = (currentIndex === images.length - 1 ? 0 : currentIndex + 1);
            return { ...prevState, [roomId]: newIndex };
        });
    };

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    const handleBookNow = () => {
        setIsFormVisible(true);
    };

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Rooms</h2>

                <RadioGroup value={selectedRoom} onChange={setSelectedRoom} className="mt-6">
                    <RadioGroup.Label className="sr-only">Choose a room</RadioGroup.Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room) => (
                            <RadioGroup.Option
                                key={room.id}
                                value={room}
                                className={({ active }) =>
                                    classNames(
                                        active ? 'ring-2 ring-indigo-500' : '',
                                        'relative block border border-gray-300 rounded-lg p-4 shadow-sm focus:outline-none'
                                    )
                                }
                            >
                                {({ checked }) => (
                                    <>
                                        <div className="flex flex-col">
                                            <div className="relative mt-4">
                                                <div
                                                    id={`carousel${room.id}`}
                                                    className="relative"
                                                >
                                                    {/* Image carousel code */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute top-1 right-1 text-gray-900">
                                            {checked && (
                                                <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                                            )}
                                        </div>
                                    </>
                                )}
                            </RadioGroup.Option>
                        ))}
                    </div>
                </RadioGroup>

                {selectedRoom && (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold">{selectedRoom.name}</h3>
                        <p className="text-gray-500">{selectedRoom.description}</p>
                        <button
                            onClick={handleBookNow}
                            className="mt-4 rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700"
                        >
                            Book Now
                        </button>
                    </div>
                )}
            </div>
            {isFormVisible && <ReservationForm selectedRoomId={selectedRoom.id} />}
        </div>
    );
}
