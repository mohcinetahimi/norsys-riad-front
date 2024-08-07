import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../token/config'; // Import the configured axios instance
import * as yup from 'yup';
import { useFlashMessage } from '../../../contexts/FlashMessageContext'; // Import the hook
import _ from 'lodash'; // Import lodash for deep comparison

// Define the validation schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required').max(180, 'Email cannot exceed 180 characters'),
  username: yup.string().required('Username is required').max(180, 'Username cannot exceed 180 characters'),
  roles: yup.array().of(yup.string().oneOf(['ROLE_USER', 'ROLE_ADMIN'])).required('Roles are required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters').max(255, 'Password cannot exceed 255 characters'),
  firstname: yup.string().required('First name is required').max(255, 'First name cannot exceed 255 characters'),
  secondname: yup.string().required('Second name is required').max(255, 'Second name cannot exceed 255 characters'),
  cin: yup.string().required('CIN is required').max(20, 'CIN cannot exceed 20 characters'),
  address: yup.string().required('Address is required').max(255, 'Address cannot exceed 255 characters'),
  tele: yup.string().required('Telephone is required').max(15, 'Telephone cannot exceed 15 characters'),
});

// Function to fetch user by ID
const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`); // Use axiosInstance
  return response.data;
};

// Function to update user
const updateUser = async (user) => {
  const response = await axiosInstance.put(`/users/${user.id}`, user); // Use axiosInstance
  return response.data;
};

// Function to normalize data
const normalizeData = (data) => {
  return {
    email: data.email || '',
    username: data.username || '',
    roles: data.roles || [],
    password: data.password || '',
    firstname: data.firstname || '',
    secondname: data.secondname || '',
    cin: data.cin || '',
    address: data.address || '',
    tele: data.tele || '',
  };
};

// EditUser component
const EditUser = ({ userId, onClose }) => {
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [originalData, setOriginalData] = useState(null); // State to store original user data
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { showFlashMessage } = useFlashMessage(); // Use flash message context

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await getUserById(userId);
        const normalizedData = normalizeData(userData);
        setOriginalData(normalizedData); // Store the original data
        setValue('email', normalizedData.email);
        setValue('username', normalizedData.username);
        setValue('roles', normalizedData.roles);
        setValue('password', normalizedData.password);
        setValue('firstname', normalizedData.firstname);
        setValue('secondname', normalizedData.secondname);
        setValue('cin', normalizedData.cin);
        setValue('address', normalizedData.address);
        setValue('tele', normalizedData.tele);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, setValue]);

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showFlashMessage('User updated successfully!', 'success'); // Show success message
      onClose();
    },
    onError: (error) => {
      console.error('Updating user failed:', error);
      showFlashMessage('Failed to update user. Please try again.', 'error'); // Show error message
    }
  });

  const onSubmit = (data) => {
    const normalizedFormData = normalizeData(data);
    const hasChanges = !_.isEqual(normalizedFormData, originalData);

    if (hasChanges) {
      // Submit the form data to the server
      mutation.mutate({ ...data, id: userId });
    } else {
      // Inform the user that no changes were detected
      showFlashMessage('No changes detected. Please modify the data before saving.', 'info');
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <p className="mt-1 text-sm leading-6 text-gray-600">Edit the details of the user below.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Email */}
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("email")}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>

              {/* Username */}
              <div className="sm:col-span-3">
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("username")}
                  />
                  {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
                </div>
              </div>

              {/* Roles */}
              <div className="sm:col-span-6">
                <label htmlFor="roles" className="block text-sm font-medium leading-6 text-gray-900">
                  Roles
                </label>
                <div className="mt-2">
                  <select
                    name="roles"
                    id="roles"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("roles")}
                    multiple
                  >
                    <option value="ROLE_USER">User</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                  {errors.roles && <p className="mt-2 text-sm text-red-600">{errors.roles.message}</p>}
                </div>
              </div>

              {/* Password */}
              <div className="sm:col-span-6">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("password")}
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                </div>
              </div>

              {/* First Name */}
              <div className="sm:col-span-6">
                <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("firstname")}
                  />
                  {errors.firstname && <p className="mt-2 text-sm text-red-600">{errors.firstname.message}</p>}
                </div>
              </div>

              {/* Second Name */}
              <div className="sm:col-span-6">
                <label htmlFor="secondname" className="block text-sm font-medium leading-6 text-gray-900">
                  Second Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="secondname"
                    id="secondname"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("secondname")}
                  />
                  {errors.secondname && <p className="mt-2 text-sm text-red-600">{errors.secondname.message}</p>}
                </div>
              </div>

              {/* CIN */}
              <div className="sm:col-span-6">
                <label htmlFor="cin" className="block text-sm font-medium leading-6 text-gray-900">
                  CIN
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="cin"
                    id="cin"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("cin")}
                  />
                  {errors.cin && <p className="mt-2 text-sm text-red-600">{errors.cin.message}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                  Address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("address")}
                  />
                  {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>}
                </div>
              </div>

              {/* Telephone */}
              <div className="sm:col-span-6">
                <label htmlFor="tele" className="block text-sm font-medium leading-6 text-gray-900">
                  Telephone
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="tele"
                    id="tele"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("tele")}
                  />
                  {errors.tele && <p className="mt-2 text-sm text-red-600">{errors.tele.message}</p>}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-x-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-block rounded-md px-3.5 py-1.5 text-sm font-semibold ring-1 ring-gray-900/10 hover:ring-gray-900/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-block rounded-md px-3.5 py-1.5 text-sm font-semibold text-white ring-1 ring-gray-900/10 bg-indigo-600 hover:ring-indigo-600"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
