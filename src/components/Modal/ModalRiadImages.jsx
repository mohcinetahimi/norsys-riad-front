import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { CloudArrowUpIcon } from '@heroicons/react/24/solid';

const ModalRiadImage = ({ riadId, isOpen, onClose }) => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (riadId && isOpen) {
      fetchImages();
    }
  }, [riadId, isOpen]);

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('token_admin');
      const { data } = await axios.get(`http://localhost:8000/api/riad_images/${riadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!Array.isArray(data['hydra:member'])) {
        throw new Error('Invalid data format');
      }

      setImages(data['hydra:member']);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token_admin');
      await axios.post(`http://localhost:8000/api/riad_images/${riadId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setFile(null);
      fetchImages(); // Refresh images list
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-sm mx-auto bg-white p-4 rounded-md shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-gray-900">Riad Images</Dialog.Title>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div className="mt-4">
            <input type="file" onChange={handleFileChange} />
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
          <div className="mt-4">
            <h2 className="text-md font-semibold text-gray-900">Current Images</h2>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {images.map((image) => (
                <img
                  key={image.id}
                  src={image.url} // Ensure URL field is correct
                  alt={image.description || 'Image'}
                  className="w-full h-32 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalRiadImage;
