import React, { useState, useRef, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import axios from 'axios';
import ReservationForm from '../Profil/ReservationForm.jsx'; // Adjust the path as necessary

const BASE_URL = 'http://localhost:8000';

export default function RoomList({ rooms }) {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomDetails, setRoomDetails] = useState({});
    const [activeImageIndex, setActiveImageIndex] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const formRef = useRef(null); // Create a ref for the form

    const fetchRoomDetails = async (roomId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/rooms/${roomId}`);
            const roomData = response.data;

            setRoomDetails(prevDetails => ({
                ...prevDetails,
                [roomId]: roomData
            }));

            if (roomData.images && roomData.images.length > 0) {
                setActiveImageIndex(prevState => ({
                    ...prevState,
                    [roomId]: 0
                }));
            }

            if (selectedRoom && selectedRoom.id === roomId) {
                setActiveImageIndex(prevState => ({ ...prevState, [roomId]: 0 }));
            }
        } catch (error) {
            console.error('Error fetching room details:', error);
        }
    };

    useEffect(() => {
        if (rooms.length > 0) {
            rooms.forEach(room => {
                fetchRoomDetails(room.id);
            });
        }
    }, [rooms]);

    useEffect(() => {
        if (rooms.length > 0 && !selectedRoom) {
            setSelectedRoom(rooms[0]);
        }
    }, [rooms, selectedRoom]);

    const handlePrev = (roomId) => {
        setActiveImageIndex(prevState => {
            const currentIndex = prevState[roomId] || 0;
            const images = roomDetails[roomId]?.images || [];
            const newIndex = (currentIndex === 0 ? images.length - 1 : currentIndex - 1);
            return { ...prevState, [roomId]: newIndex };
        });
    };

    const handleNext = (roomId) => {
        setActiveImageIndex(prevState => {
            const currentIndex = prevState[roomId] || 0;
            const images = roomDetails[roomId]?.images || [];
            const newIndex = (currentIndex === images.length - 1 ? 0 : currentIndex + 1);
            return { ...prevState, [roomId]: newIndex };
        });
    };

    const handleThumbnailClick = (roomId, index) => {
        setActiveImageIndex(prevState => ({
            ...prevState,
            [roomId]: index
        }));
    };

    const handleBookNow = () => {
        setIsFormVisible(true);

        // Delay scroll to ensure form is visible
        setTimeout(() => {
            if (formRef.current) {
                formRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100); // Adjust delay if needed
    };

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Available Rooms</h2>

                <RadioGroup value={selectedRoom} onChange={setSelectedRoom} className="mt-6">
                    <RadioGroup.Label className="sr-only">Choose a room</RadioGroup.Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map((room) => (
                            <RadioGroup.Option
                                key={room.id}
                                value={room}
                                className={({ active }) =>
                                    classNames(
                                        active ? 'ring-2 ring-indigo-500' : '',
                                        'relative block border border-gray-300 rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none'
                                    )
                                }
                            >
                                {({ checked }) => (
                                    <>
                                        <div className="flex flex-col">
                                            <div className="relative bg-white rounded-lg shadow-md p-4">
                                                <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                                                <p className="mt-1 text-gray-600">{room.description}</p>
                                                <p className="mt-2 text-gray-800">Price: ${roomDetails[room.id]?.price || 'N/A'}</p>
                                                <p className="mt-2 text-gray-800">Max People: {roomDetails[room.id]?.nb_personne || 'N/A'}</p>

                                                {checked && (
                                                    <div className="mt-4 flex justify-between items-center">
                                                        <button
                                                            onClick={handleBookNow}
                                                            className="rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 transition-colors"
                                                        >
                                                            Book Now
                                                        </button>
                                                        <div className="text-gray-900">
                                                            <CheckCircleIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="relative mt-4">
                                                {roomDetails[room.id]?.images && roomDetails[room.id]?.images.length > 0 && (
                                                    <div className="w-full bg-white rounded-lg overflow-hidden shadow-md">
                                                        <img
                                                            src={`${BASE_URL}/${roomDetails[room.id].images[activeImageIndex[room.id]]?.imageUrl}`}
                                                            alt={roomDetails[room.id].images[activeImageIndex[room.id]]?.imageName}
                                                            className="w-full h-[400px] object-cover rounded-lg"
                                                        />
                                                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 flex w-full justify-between px-4">
                                                            <button
                                                                className="bg-white text-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100"
                                                                onClick={() => handlePrev(room.id)}
                                                            >
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                                            </button>
                                                            <button
                                                                className="bg-white text-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100"
                                                                onClick={() => handleNext(room.id)}
                                                            >
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                                            </button>
                                                        </div>
                                                        <div className="flex mt-2 space-x-2 justify-center">
                                                            {roomDetails[room.id]?.images.map((image, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={`${BASE_URL}/${image.imageUrl}`}
                                                                    alt={image.imageName}
                                                                    className={classNames(
                                                                        'w-16 h-16 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-indigo-500',
                                                                        index === activeImageIndex[room.id] ? 'border-indigo-500' : ''
                                                                    )}
                                                                    onClick={() => handleThumbnailClick(room.id, index)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </RadioGroup.Option>
                        ))}
                    </div>
                </RadioGroup>
            </div>
            {isFormVisible && <div ref={formRef}><ReservationForm selectedRoomId={selectedRoom.id} /></div>}
        </div>
    );
}
