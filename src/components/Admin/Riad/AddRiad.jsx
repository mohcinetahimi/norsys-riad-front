import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOpen } from '../../../contexts/OpenContext'; // Update import path
import { useFlashMessage } from '../../../contexts/FlashMessageContext'; // Adjust the import path

const schema = yup.object().shape({
  name: yup.string().required('Name is required').max(255, 'Name cannot exceed 255 characters'),
  description: yup.string().required('Description is required'),
  address: yup.string().required('Address is required').max(255, 'Address cannot exceed 255 characters'),
  city: yup.string().required('City is required').max(255, 'City cannot exceed 255 characters'),
});

const addRiad = async (formData) => {
  const token = localStorage.getItem('token_admin');

  const response = await axios.post('http://localhost:8000/api/riiads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.data;
};

const AddRiad = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const queryClient = useQueryClient();
  const { closeModal } = useOpen();
  const { showFlashMessage } = useFlashMessage();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const mutation = useMutation({
    mutationFn: addRiad,
    onSuccess: () => {
      queryClient.invalidateQueries(['riads']);
      closeModal('modalAdd');
      showFlashMessage('Riad added successfully!');
    },
    onError: (error) => {
      console.error('Adding riad failed:', error);
      showFlashMessage('Failed to add riad.');
    }
  });

  const onSubmit = (data) => {
    if (selectedFiles.length === 0) {
      showFlashMessage('Please upload at least one image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('address', data.address);
    formData.append('city', data.city);

    selectedFiles.forEach(file => {
      formData.append('imageFiles[]', file);
    });

    mutation.mutate(formData);
  };

  const handleImageChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <p className="mt-1 text-sm leading-6 text-gray-600">Enter the details of the new riad below.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Name */}
              <div className="sm:col-span-6">
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

              {/* Address */}
              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">Address</label>
                <input
                  type="text"
                  id="address"
                  {...register('address')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.address && <p className="text-red-600">{errors.address.message}</p>}
              </div>

              {/* City */}
              <div className="sm:col-span-6">
                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">City</label>
                <input
                  type="text"
                  id="city"
                  {...register('city')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.city && <p className="text-red-600">{errors.city.message}</p>}
              </div>

              {/* Images */}
              <div className="sm:col-span-6">
                <label htmlFor="imageFiles" className="block text-sm font-medium leading-6 text-gray-900">Images</label>
                <input
                  type="file"
                  id="imageFiles"
                  multiple
                  onChange={handleImageChange}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {selectedFiles.length === 0 && (
                  <p className="text-red-600">Please upload at least one image.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-x-4">
            <button
              type="submit"
              disabled={selectedFiles.length === 0} // Disable button if no image
              className={`inline-block px-3 py-1.5 text-white rounded-md shadow-sm ring-1 ring-gray-300 sm:text-sm ${selectedFiles.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600'}`}
            >
              Add Riad
            </button>
            <button
              type="button"
              onClick={() => closeModal('modalAdd')}
              className="inline-block px-3 py-1.5 text-white bg-gray-600 rounded-md shadow-sm ring-1 ring-gray-300 hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRiad;
