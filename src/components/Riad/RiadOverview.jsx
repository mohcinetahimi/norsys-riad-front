import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { Radio, RadioGroup } from '@headlessui/react';
import Riad1 from '../../assets/riad1.jpg';
import Riad2 from '../../assets/riad2.jpg';
import Riad3 from '../../assets/riad3.jpg';
import Riad4 from '../../assets/riad4.jpg';

// Sample data for riads
const riads = [
    {
        id: 1,
        name: 'Riad Dar Al Hossoun',
        price: '€120 per night',
        breadcrumbs: [
            { id: 1, name: 'Home', href: '/' },
            { id: 2, name: 'Marrakech', href: '/' },
        ],
        images: [
            { src: Riad1, alt: 'Beautiful view of the riad with a pool and garden.' },
            { src: Riad2, alt: 'Cozy room with traditional Moroccan decor.' },
            { src: Riad3, alt: 'Dining area with Moroccan cuisine.' },
            { src: Riad4, alt: 'Rooftop terrace with a view of the city.' },
        ],
        roomTypes: [
            { name: 'Standard Room', class: 'bg-white', selectedClass: 'ring-gray-400' },
            { name: 'Deluxe Room', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
            { name: 'Suite', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
        ],
        amenities: [
            'Free WiFi',
            'Complimentary Breakfast',
            'Airport Shuttle',
            'Swimming Pool',
            'Air Conditioning',
        ],
        policies: [
            'Check-in from 2:00 PM - 10:00 PM',
            'Check-out by 12:00 PM',
            'Pets are not allowed',
        ],
        description: 'Riad Dar Al Hossoun is a beautiful traditional Moroccan guesthouse located in the heart of Marrakech. Enjoy the tranquil garden, refreshing pool, and authentic decor.',
        reviews: { href: '#', average: 4, totalCount: 117 },
    },
    // Add more riads if needed
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function RiadOverview() {
    const { id } = useParams();
    const riad = riads.find((r) => r.id === parseInt(id));
    const [selectedRoom, setSelectedRoom] = useState(riad.roomTypes[0]);

    if (!riad) {
        return <div>Riad not found</div>;
    }

    return (
        <div className="bg-white">
            <div className="pt-6">
                <nav aria-label="Breadcrumb">
                    <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        {riad.breadcrumbs.map((breadcrumb) => (
                            <li key={breadcrumb.id}>
                                <div className="flex items-center">
                                    <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900">
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
                            <a href="#" aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                                {riad.name}
                            </a>
                        </li>
                    </ol>
                </nav>

                {/* Image gallery */}
                <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                    <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
                        <img
                            alt={riad.images[0].alt}
                            src={riad.images[0].src}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                    <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                            <img
                                alt={riad.images[1].alt}
                                src={riad.images[1].src}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                            <img
                                alt={riad.images[2].alt}
                                src={riad.images[2].src}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                    </div>
                    <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
                        <img
                            alt={riad.images[3].alt}
                            src={riad.images[3].src}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                </div>

                {/* Riad info */}
                <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{riad.name}</h1>
                    </div>

                    {/* Options */}
                    <div className="mt-4 lg:row-span-3 lg:mt-0">
                        <h2 className="sr-only">Riad information</h2>
                        <p className="text-3xl tracking-tight text-gray-900">{riad.price}</p>

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
                                                riad.reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                                                'h-5 w-5 flex-shrink-0',
                                            )}
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">{riad.reviews.average} out of 5 stars</p>
                                <a href={riad.reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                    {riad.reviews.totalCount} reviews
                                </a>
                            </div>
                        </div>

                        <form className="mt-10">
                            {/* Room Types */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Room Type</h3>

                                <fieldset aria-label="Choose a room type" className="mt-4">
                                    <RadioGroup value={selectedRoom} onChange={setSelectedRoom} className="flex items-center space-x-3">
                                        {riad.roomTypes.map((room) => (
                                            <Radio
                                                key={room.name}
                                                value={room}
                                                aria-label={room.name}
                                                className={classNames(
                                                    room.selectedClass,
                                                    'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1',
                                                )}
                                            >
                      <span
                          aria-hidden="true"
                          className={classNames(
                              room.class,
                              'h-8 w-8 rounded-full border border-black border-opacity-10',
                          )}
                      />
                                            </Radio>
                                        ))}
                                    </RadioGroup>
                                </fieldset>
                            </div>

                            <button
                                type="submit"
                                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Book Now
                            </button>
                        </form>
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
                                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                                    {riad.amenities.map((amenity) => (
                                        <li key={amenity} className="text-gray-400">
                                            <span className="text-gray-600">{amenity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-sm font-medium text-gray-900">Policies</h2>

                            <div className="mt-4 space-y-6">
                                <p className="text-sm text-gray-600">{riad.policies.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
