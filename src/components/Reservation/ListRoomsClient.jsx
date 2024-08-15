import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ListRoomsClient = ({ rooms }) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Rooms</h2>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96">
                <Slider {...sliderSettings}>
                  {room.images.map((image) => (
                    <img
                      key={image.id}
                      src={`http://localhost:8000${image.imageUrl}`}
                      alt={image.imageName}
                      className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                    />
                  ))}
                </Slider>
              </div>
              <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="text-sm font-medium text-gray-900">
                  <a href={`/rooms/${room.id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {room.name}
                  </a>
                </h3>
                <p className="text-sm text-gray-500">{room.description}</p>
                <div className="flex flex-1 flex-col justify-end">
                  <p className="text-sm italic text-gray-500">{room.nb_personne} guests</p>
                  <p className="text-base font-medium text-gray-900">${room.price} per night</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListRoomsClient;
