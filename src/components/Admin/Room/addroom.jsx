import React, { useState } from 'react';
import axios from 'axios';

const RoomForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nbPersonne, setNbPersonne] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('nb_personne', nbPersonne);
    formData.append('price', price);

    Array.from(images).forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post('/api/rooms', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Room added successfully:', response.data);
      // Reset form fields
      setName('');
      setDescription('');
      setNbPersonne('');
      setPrice('');
      setImages([]);
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Room Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Number of People:
          <input
            type="number"
            value={nbPersonne}
            onChange={(e) => setNbPersonne(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Price:
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Upload Images:
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>
      <button type="submit">Add Room</button>
    </form>
  );
};

export default RoomForm;
