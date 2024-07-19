/*import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RiadList() {
    const [riads, setRiads] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/riads')
            .then(response => {
                setRiads(response.data);
            })
            .catch(error => {
                console.error('Error fetching riads:', error);
            });
    }, []);

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-10 text-center">
                    Selection of Riads
                </h2>

                <div
                    className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {riads.map((riad) => (
                        <a key={riad.id} href={`/riad/${riad.id}`} className="group">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                <img
                                    alt={riad.name}
                                    src={`http://localhost:8000/uploads/images/${riad.image}`} // Adjust path based on your backend configuration
                                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                                />
                            </div>
                            <h3 className="mt-4 text-sm text-gray-700">{riad.name}</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{riad.price}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

*/


import Riad1 from '../../assets/riad1.jpg';
import Riad2 from '../../assets/riad2.jpg';
import Riad3 from '../../assets/riad3.jpg';
import Riad4 from '../../assets/riad4.jpg';


const riads = [
    {
        id: 1,
        name: 'Deluxe Room',
        href: '#',
        price: '€120 per night',
        imageSrc: Riad1 ,
        imageAlt: 'Spacious deluxe room with a large bed, traditional Moroccan decor, and a private balcony.',
    },
    {
        id: 2,
        name: 'Superior Room',
        href: '#',
        price: '€100 per night',
        imageSrc: Riad2 , // Update with actual image URL
        imageAlt: 'Comfortable superior room with modern amenities and traditional touches.',
    },
    {
        id: 3,
        name: 'Standard Room',
        href: '#',
        price: '€80 per night',
        imageSrc: Riad3 ,
        imageAlt: 'Cozy standard room with essential amenities and Moroccan decor.',
    },
    {
        id: 4,
        name: 'Suite',
        href: '#',
        price: '€150 per night',
        imageSrc: Riad4 ,
        imageAlt: 'Luxurious suite with a separate living area, large bed, and exquisite decor.',
    },
// More rooms...
]

export default function RiadList() {
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-10 text-center">
                    Selection of Riads
                </h2>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {riads.map((riads) => (
                        <a key={riads.id} href={`/riad/${riads.id}`} className="group">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                <img
                                    alt={riads.imageAlt}
                                    src={riads.imageSrc}
                                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                                />
                            </div>
                            <h3 className="mt-4 text-sm text-gray-700">{riads.name}</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{riads.price}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

