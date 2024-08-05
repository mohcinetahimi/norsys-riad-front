import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RiadList() {
    const [riads, setRiads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRiads = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/riads');
                console.log(response.data); 
                // Extract riads array from response data
                setRiads(response.data['hydra:member'] || []);
            } catch (error) {
                console.error('Error fetching riads:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRiads();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <div className="bg-white" id="riads">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-10 text-center">
                        Selection of Riads
                    </h2>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {riads.map((riad) => {
                            // Assuming the first image in the images array is the main image
                            const mainImage = riad.images.length > 0 ? riad.images[0].imageUrl : 'default-image-url.jpg'; // Use a default image if no image is available
                            return (
                                <a key={riad.id} href={`/riad/${riad.id}`} className="group">
                                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                        <img
                                            alt={riad.name}
                                            src={`http://localhost:8000${mainImage}`} // Adjust path based on your backend configuration
                                            className="h-full w-full object-cover object-center group-hover:opacity-75"
                                        />
                                    </div>
                                    <h3 className="mt-4 text-sm text-gray-700">{riad.name}</h3>
                                    <p className="mt-1 text-lg font-medium text-gray-900">{riad.price}</p>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
