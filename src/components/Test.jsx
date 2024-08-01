// src/components/UploadImage.js
import React, { useState } from 'react';
import axios from 'axios';

export default function UploadImage({ roomId }) {
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('imageFile', image);
    formData.append('room', roomId);

    try {
      await axios.post('http://127.0.0.1:8000/api/room_images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Image uploaded successfully');
      setImage(null); // Reset the input
    } catch (err) {
      setError('Error uploading image');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}
