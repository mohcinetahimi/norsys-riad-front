import React, { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';

// Sample static data for rooms
const rooms = [
    {
        id: 1,
        name: 'Standard Room',
        price: '€80 per night',
        description: 'A cozy room with traditional Moroccan decor and modern amenities.',
    },
    {
        id: 2,
        name: 'Deluxe Room',
        price: '€120 per night',
        description: 'A spacious room with luxurious furnishings and a beautiful view.',
    },
    {
        id: 3,
        name: 'Suite',
        price: '€200 per night',
        description: 'An expansive suite with separate living area and premium amenities.',
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function RoomList() {
    const [selectedRoom, setSelectedRoom] = useState(rooms[0]);

    return (
        <div className="bg-white">
            <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Rooms</h2>

                <RadioGroup value={selectedRoom} onChange={setSelectedRoom} className="mt-6">
                    <RadioGroup.Label className="sr-only">Choose a room</RadioGroup.Label>
                    <div className="space-y-4">
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
                                        <div className="flex justify-between">
                                            <div className="flex-1">
                                                <RadioGroup.Label as="p" className="text-lg font-medium text-gray-900">
                                                    {room.name}
                                                </RadioGroup.Label>
                                                <RadioGroup.Description as="p" className="text-sm text-gray-500">
                                                    {room.price}
                                                </RadioGroup.Description>
                                            </div>
                                            {checked && (
                                                <div className="flex-shrink-0">
                                                    <CheckCircleIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                                                </div>
                                            )}
                                        </div>
                                        <RadioGroup.Description as="p" className="mt-2 text-sm text-gray-500">
                                            {room.description}
                                        </RadioGroup.Description>
                                    </>
                                )}
                            </RadioGroup.Option>
                        ))}
                    </div>
                </RadioGroup>

                <button
                    type="button"
                    className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Book Now
                </button>
            </div>
        </div>
    );
}
