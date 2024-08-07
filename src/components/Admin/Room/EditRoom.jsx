import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import * as yup from 'yup';

// Define schema for Room entity
const schema = yup.object().shape({
  name: yup.string().required('Name is required').max(100, 'Name cannot exceed 100 characters'),
  price: yup.number().required('Price is required').min(0, 'Price cannot be negative'),
  nb_personne: yup.number().required('Number of persons is required').min(1, 'Number of persons must be at least 1'),
  description: yup.string().required('Description is required').max(500, 'Description cannot exceed 500 characters'),
});

// Fetch Room by ID
const getRoomById = async (roomId) => {
  const response = await axios.get(`http://localhost:8000/api/rooms/${roomId}`, {
    headers: {
      'accept': 'application/ld+json',
    },
  });
  return response.data;
};

// Edit Room entity
const editRoom = async (room) => {
  const response = await axios.put(`http://localhost:8000/api/rooms/${room.id}`, room, {
    headers: {
      'Content-Type': 'application/ld+json',
    },
  });
  return response.data;
};

const EditRoom = ({ roomId, onClose }) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await getRoomById(roomId);
        reset(roomData); // Reset form with fetched data
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId, reset]);

  const mutation = useMutation({
    mutationFn: editRoom,
    onSuccess: () => {
      queryClient.invalidateQueries(['rooms']);
      onClose();
    },
    onError: (error) => {
      console.error('Editing room failed:', error);
    }
  });

  const onSubmit = (data) => {
    // Add the id_riad directly to the data being sent
    const roomData = { ...data, id: roomId, id_riad: data.id_riad };
    mutation.mutate(roomData);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <p className="mt-1 text-sm leading-6 text-gray-600">Edit the details of the room below.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("name")}
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                  Price
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("price")}
                  />
                  {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="nb_personne" className="block text-sm font-medium leading-6 text-gray-900">
                  Number of Persons
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="nb_personne"
                    id="nb_personne"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("nb_personne")}
                  />
                  {errors.nb_personne && <p className="mt-2 text-sm text-red-600">{errors.nb_personne.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    name="description"
                    id="description"
                    rows="4"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("description")}
                  />
                  {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRoom;
