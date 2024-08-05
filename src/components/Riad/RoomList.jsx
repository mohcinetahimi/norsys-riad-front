import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import axios from 'axios';

// Define the base URL for your API
const BASE_URL = 'http://localhost:8000';

// Define the RoomList component with rooms as a prop
export default function RoomList({ rooms }) {
    const [selectedRoom, setSelectedRoom] = useState(rooms[0] || null);
    const [roomImages, setRoomImages] = useState({});
    const [activeImageIndex, setActiveImageIndex] = useState({});

    // Fetch images for a specific room
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

    // Handle carousel image change
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

    // Utility function for conditional class names
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    // Handle booking action
    const handleBookNow = () => {
        if (selectedRoom) {
            // Implement booking logic here
            alert(`Booked ${selectedRoom.name}`);
        } else {
            alert('No room selected');
        }
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
                                                    data-twe-carousel-init
                                                    data-twe-ride="carousel"
                                                >
                                                    <div
                                                        className="absolute inset-x-0 bottom-0 z-[2] mx-[15%] mb-4 flex list-none justify-center p-0"
                                                        data-twe-carousel-indicators
                                                    >
                                                        {roomImages[room.id] && roomImages[room.id].map((_, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                data-twe-target={`#carousel${room.id}`}
                                                                data-twe-slide-to={index}
                                                                className={classNames(
                                                                    'mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none',
                                                                    index === (activeImageIndex[room.id] || 0) && 'opacity-100'
                                                                )}
                                                                aria-label={`Slide ${index + 1}`}
                                                            />
                                                        ))}
                                                    </div>

                                                    <div
                                                        className="relative w-full overflow-hidden after:clear-both after:block after:content-['']"
                                                    >
                                                        {roomImages[room.id] && roomImages[room.id].map((image, index) => (
                                                            <div
                                                                key={image.id}
                                                                className={classNames(
                                                                    'relative float-left -mr-[100%] w-full !transform-none transition-opacity duration-[600ms] ease-in-out motion-reduce:transition-none',
                                                                    index === (activeImageIndex[room.id] || 0) ? 'opacity-100' : 'opacity-0'
                                                                )}
                                                                data-twe-carousel-fade
                                                                data-twe-carousel-item
                                                                data-twe-carousel-active={index === (activeImageIndex[room.id] || 0)}
                                                            >
                                                                <img
                                                                    src={`${BASE_URL}${image.imageUrl}`}
                                                                    alt={image.imageName}
                                                                    className="block w-full"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {roomImages[room.id] && roomImages[room.id].length > 1 && (
                                                        <>
                                                            <button
                                                                className="absolute bottom-0 left-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
                                                                type="button"
                                                                data-twe-target={`#carousel${room.id}`}
                                                                data-twe-slide="prev"
                                                                onClick={() => handlePrev(room.id)}
                                                            >
                                                                <span className="inline-block h-8 w-8">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth="1.5"
                                                                        stroke="black"
                                                                        className="h-6 w-6"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M15.75 19.5L8.25 12l7.5-7.5"
                                                                        />
                                                                    </svg>
                                                                </span>
                                                                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Previous</span>
                                                            </button>
                                                            <button
                                                                className="absolute bottom-0 right-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
                                                                type="button"
                                                                data-twe-target={`#carousel${room.id}`}
                                                                data-twe-slide="next"
                                                                onClick={() => handleNext(room.id)}
                                                            >
                                                                <span className="inline-block h-8 w-8">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth="1.5"
                                                                        stroke="black"
                                                                        className="h-6 w-6"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                                                        />
                                                                    </svg>
                                                                </span>
                                                                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Next</span>
                                                            </button>
                                                        </>
                                                    )}
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
        </div>
    );
}
