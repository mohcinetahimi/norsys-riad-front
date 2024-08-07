import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomImages = ({ roomId=4 }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/rooms/${roomId}`);
        setImages(response.data.images);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [roomId]);

  return (
    <div>
      <h2>Room Images</h2>
      <div>
        {images.length > 0 ? (
          images.map((image) => (
            <img
              key={image.id}
              src={`http://localhost:8000/images/rooms/${image.imageName}`}
              alt={`Room ${roomId}`}
              style={{ width: '200px', margin: '10px' }}
            />
          ))
        ) : (
          <p>No images found for this room.</p>
        )}
      </div>
    </div>
  );
};

export default RoomImages;
