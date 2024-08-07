import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import RoomList from './RoomList.jsx'; // Import the RoomList component
import ReservationForm from '../Profil/ReservationForm.jsx'; // Import the ReservationForm component
import axios from 'axios'; // Import axios for data fetching
import '../../assets/style/loading.css'; // Import the loading spinner CSS

// Base URL for the API
const BASE_URL = 'http://localhost:8000';

// Function to fetch riad details
const fetchRiadDetails = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/riads/${id}`);
        console.log('Riad details:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching riad details:', error);
        return null;
    }
};

// Utility function for conditional class names
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function RiadOverview() {
    const { id } = useParams();
    const [riad, setRiad] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        const getRiadDetails = async () => {
            const riadData = await fetchRiadDetails(id);
            setRiad(riadData);
            setLoading(false);
        };

        getRiadDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <div className="loading-text">Loading...</div>
            </div>
        );
    }

    if (!riad) {
        return <div>Riad not found</div>;
    }

    const breadcrumbs = riad.breadcrumbs || [];
    const images = riad.images || [];
    const amenities = riad.amenities || [];
    const policies = riad.policies || [];
    const reviews = riad.reviews || { average: 0, totalCount: 0, href: '#' };

    const handleBookNow = (room) => {
        setSelectedRoom(room);
    };

    const handleCloseForm = () => {
        setSelectedRoom(null);
    };

    return (
        <div className="bg-white">
            <div className="pt-6">
                <nav aria-label="Breadcrumb">
                    <ol
                        role="list"
                        className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
                    >
                        {breadcrumbs.map((breadcrumb) => (
                            <li key={breadcrumb.id}>
                                <div className="flex items-center">
                                    <a
                                        href={breadcrumb.href}
                                        className="mr-2 text-sm font-medium text-gray-900"
                                    >
                                        {breadcrumb.name}
                                    </a>
                                    <svg
                                        fill="currentColor"
                                        width={16}
                                        height={20}
                                        viewBox="0 0 16 20"
                                        aria-hidden="true"
                                        className="h-5 w-4 text-gray-300"
                                    >
                                        <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                                    </svg>
                                </div>
                            </li>
                        ))}
                        <li className="text-sm">
                            <a
                                href="#"
                                aria-current="page"
                                className="font-medium text-gray-500 hover:text-gray-600"
                            >
                                {riad.name}
                            </a>
                        </li>
                    </ol>
                </nav>

                {/* Image gallery */}
                <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                    {/* Main Image (Visible on large screens) */}
                    <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
                        <img
                            alt={images[0].imageName || 'Riad Image'}
                            src={images[0].imageUrl ? `${BASE_URL}${images[0].imageUrl}` : '/default-image.jpg'}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>

                    {/* Secondary Images (Visible on large screens) */}
                    <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                        {images.slice(1, 3).map((image, index) => (
                            <div key={index} className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                <img
                                    alt={image.imageName || 'Riad Image'}
                                    src={image.imageUrl ? `${BASE_URL}${image.imageUrl}` : '/default-image.jpg'}
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Additional Image (Visible on large screens) */}
                    {images.length > 3 && (
                        <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
                            <img
                                alt={images[3].imageName || 'Riad Image'}
                                src={images[3].imageUrl ? `${BASE_URL}${images[3].imageUrl}` : '/default-image.jpg'}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                    )}
                </div>

                {/* Riad info */}
                <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            {riad.name}
                        </h1>
                        <button
                            onClick={() => handleBookNow(riad.rooms[0])} // Example: Book the first room
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* Options */}
                    <div className="mt-4 lg:row-span-3 lg:mt-0">
                        <h2 className="sr-only">Riad information</h2>
                        <p className="text-3xl tracking-tight text-gray-900">
                            {riad.price}
                        </p>

                        {/* Reviews */}
                        <div className="mt-6">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <StarIcon
                                            key={rating}
                                            aria-hidden="true"
                                            className={classNames(
                                                reviews.average > rating
                                                    ? 'text-gray-900'
                                                    : 'text-gray-200',
                                                'h-5 w-5 flex-shrink-0'
                                            )}
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">
                                    {reviews.average} out of 5 stars
                                </p>
                                <a
                                    href={reviews.href}
                                    className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    {reviews.totalCount} reviews
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                        {/* Description and details */}
                        <div>
                            <h3 className="sr-only">Description</h3>
                            <div className="space-y-6">
                                <p className="text-base text-gray-900">{riad.description}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h3 className="text-sm font-medium text-gray-900">Amenities</h3>
                            <div className="mt-4">
                                <ul
                                    role="list"
                                    className="list-disc space-y-2 pl-4 text-sm"
                                >
                                    {amenities.map((amenity) => (
                                        <li key={amenity} className="text-gray-400">
                                            <span className="text-gray-600">{amenity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedRoom && (
                <ReservationForm
                    room={selectedRoom}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
}
