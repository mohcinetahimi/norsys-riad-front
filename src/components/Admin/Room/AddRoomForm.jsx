import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useOpen } from '../../../contexts/OpenContext';
import { useFlashMessage } from '../../../contexts/FlashMessageContext'; // Adjust the path as necessary

const schema = yup.object().shape({
  name: yup.string().required('Name is required').max(100),
  description: yup.string().required('Description is required').max(500),
  nb_personne: yup.number().required('Number of people is required').positive().integer(),
  price: yup.number().required('Price is required').positive(),
});

const addRoom = async ({ formData }) => {
  const token = localStorage.getItem('token_admin');
  const response = await axios.post('http://localhost:8000/api/roooms', formData, { // Corrected endpoint
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

const AddRoomForm = ({ riadId }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const queryClient = useQueryClient();
  const { closeModal } = useOpen();
  const { showFlashMessage } = useFlashMessage(); // Use the flash message context
  const [selectedFiles, setSelectedFiles] = useState([]);

  const mutation = useMutation({
    mutationFn: addRoom,
    onSuccess: () => {
      queryClient.invalidateQueries(['rooms']);
      closeModal(`modalManageRooms_${riadId}`); // Ensure modal identifier matches
      showFlashMessage('Room added successfully!'); // Show success message
    },
    onError: (error) => {
      console.error('Adding room failed:', error);
      showFlashMessage('Failed to add room.'); // Show error message
    }
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('nb_personne', data.nb_personne);
    formData.append('price', data.price);
    formData.append('id_riad', riadId); // Automatically set Riad ID

    selectedFiles.forEach(file => {
      formData.append('imageFiles[]', file);
    });

    mutation.mutate({ formData });
  };

  const handleImageChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <p className="mt-1 text-sm leading-6 text-gray-600">Enter the details of the new room below.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Name */}
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.name && <p className="text-red-600">{errors.name.message}</p>}
              </div>

              {/* Description */}
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                <textarea
                  id="description"
                  {...register('description')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.description && <p className="text-red-600">{errors.description.message}</p>}
              </div>

              {/* Number of People */}
              <div className="sm:col-span-3">
                <label htmlFor="nb_personne" className="block text-sm font-medium leading-6 text-gray-900">Number of People</label>
                <input
                  type="number"
                  id="nb_personne"
                  {...register('nb_personne')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.nb_personne && <p className="text-red-600">{errors.nb_personne.message}</p>}
              </div>

              {/* Price */}
              <div className="sm:col-span-3">
                <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price</label>
                <input
                  type="number"
                  id="price"
                  {...register('price')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.price && <p className="text-red-600">{errors.price.message}</p>}
              </div>

              {/* Image Upload */}
              <div className="sm:col-span-6">
                <label htmlFor="images" className="block text-sm font-medium leading-6 text-gray-900">Images</label>
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="mt-2 block w-full text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-x-4">
              <button
                type="button"
                onClick={() => closeModal(`modalManageRooms_${riadId}`)}
                className="inline-block px-3 py-1.5 text-white bg-gray-600 rounded-md shadow-sm ring-1 ring-gray-300 hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 sm:text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="inline-block px-3 py-1.5 text-white bg-blue-600 rounded-md shadow-sm ring-1 ring-gray-300 hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 sm:text-sm"
              >
                {mutation.isLoading ? 'Adding...' : 'Add Room'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRoomForm;
