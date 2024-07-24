import React from 'react';
import bgImg from '../../assets/bgImg.jpeg';
export default function Header() {

    return (
        <div className="relative isolate overflow-hidden bg-gray-900 h-screen flex items-center justify-center" id="header">
            <img
                src={bgImg}
                alt="Riad reservation system image"
                className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
            <div
                className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
                aria-hidden="true"
            >
                <div
                    className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>
            <div
                className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
                aria-hidden="true"
            >
                <div
                    className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>
            <div className="mx-auto max-w-2xl text-center flex flex-col justify-center h-full">
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">About Us</h2>
                <p className="mt-6 text-lg leading-8 text-gray-50">
                    Welcome to our Riad reservation system, your gateway to experiencing the authentic charm of Morocco. We are dedicated to connecting travelers with the most enchanting Riads nestled in the heart of Moroccan cities. Our platform is designed to offer a seamless and personalized booking experience, ensuring you find the perfect Riad that matches your preferences and needs.
                </p>
                <p className="mt-4 text-lg leading-8 text-gray-50">
                    Each Riad in our selection embodies the rich cultural heritage and stunning architectural beauty that Morocco is renowned for. From traditional decor and lush courtyards to luxurious amenities and exceptional service, our Riads provide a unique blend of comfort and tradition. Whether you are seeking a tranquil retreat or an adventure-filled getaway, our carefully curated collection of Riads promises an unforgettable stay.
                </p>
            </div>
        </div>

    );
}
