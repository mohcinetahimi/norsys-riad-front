import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RiadList() {
    const [riads, setRiads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRiads = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/riads');
                setRiads(response.data['hydra:member'] || []);
            } catch (error) {
                console.error('Error fetching riads:', error);
                setError('Failed to load riads.');
            } finally {
                setLoading(false);
            }
        };

        fetchRiads();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-10 text-center">
                Selection of Riads
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {riads.map((riad) => {
                    const mainImage = riad.images.length > 0 ? riad.images[0].imageUrl : '/path/to/default-image.jpg'; // Use a valid default image path
                    return (
                        <div key={riad.id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <a href={`/riad/${riad.id}`} aria-label={`View ${riad.name}`}>
                                <div className="relative w-full h-80 overflow-hidden rounded-t-lg bg-gray-200"> {/* Increased height */}
                                    <img 
                                        className="object-cover w-full h-full" 
                                        src={`http://localhost:8000${mainImage}`} 
                                        alt={riad.name || 'Riad image'} 
                                    />
                                </div>
                            </a>
                            <div className="p-5">
                                <a href={`/riad/${riad.id}`} aria-label={`View ${riad.name}`}>
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{riad.name}</h5>
                                </a>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{riad.description}</p>
                                <a href={`/riad/${riad.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Read more
                                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
