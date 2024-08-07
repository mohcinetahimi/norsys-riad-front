import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import * as yup from 'yup';
import { OpenContext, useOpen } from '../../../contexts/OpenContext';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().required('Username is required').max(180, 'Username cannot exceed 180 characters'),
  roles: yup.array().of(yup.string()).required('At least one role is required'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
  passwordConfirmation: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
  last_password_changed_at: yup.date().nullable(),
  firstname: yup.string().required('First name is required').max(255, 'First name cannot exceed 255 characters'),
  secondname: yup.string().required('Second name is required').max(255, 'Second name cannot exceed 255 characters'),
  cin: yup.string().required('CIN is required').max(20, 'CIN cannot exceed 20 characters'),
  address: yup.string().required('Address is required').max(255, 'Address cannot exceed 255 characters'),
  tele: yup.string().required('Telephone number is required').max(15, 'Telephone number cannot exceed 15 characters'),
});

const addUser = async (formData) => {
  const response = await axios.post('http://localhost:8000/api/register', formData);
  return response.data;
};

const AddUser = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const queryClient = useQueryClient();
  const { closeModal } = useOpen();
  const { setOpen } = useContext(OpenContext);

  const [apiErrors, setApiErrors] = useState({});

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      closeModal('modalAdd');
      showFlashMessage('User added successfully!');
    },
    onError: (error) => {
      console.error('Adding user failed:', error);
      if (error.response && error.response.data && typeof error.response.data === 'object') {
        setApiErrors(error.response.data);
      } else {
        showFlashMessage('Failed to add user.');
      }
    }
  });

  const onSubmit = (data) => {
    const formData = {
      email: data.email,
      username: data.username,
      roles: data.roles,
      password: data.password,
      passwordConfirmation: data.passwordConfirmation,
      last_password_changed_at: data.last_password_changed_at,
      firstname: data.firstname,
      secondname: data.secondname,
      cin: data.cin,
      address: data.address,
      tele: data.tele,
    };

    mutation.mutate(formData);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        {Object.keys(apiErrors).length > 0 && (
          <div className="mb-4 p-4 border border-red-600 bg-red-100 text-red-600 rounded">
            {Object.values(apiErrors).map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <p className="mt-1 text-sm leading-6 text-gray-600">Enter the details of the new user below.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                {apiErrors.email && <p className="text-red-600">{apiErrors.email}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                <input
                  type="text"
                  id="username"
                  {...register('username')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.username && <p className="text-red-600">{errors.username.message}</p>}
                {apiErrors.username && <p className="text-red-600">{apiErrors.username}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="roles" className="block text-sm font-medium leading-6 text-gray-900">Roles</label>
                <select
                  id="roles"
                  multiple
                  {...register('roles')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                >
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
                {errors.roles && <p className="text-red-600">{errors.roles.message}</p>}
                {apiErrors.roles && <p className="text-red-600">{apiErrors.roles}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                <input
                  type="password"
                  id="password"
                  {...register('password')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.password && <p className="text-red-600">{errors.password.message}</p>}
                {apiErrors.password && <p className="text-red-600">{apiErrors.password}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="passwordConfirmation" className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
                <input
                  type="password"
                  id="passwordConfirmation"
                  {...register('passwordConfirmation')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.passwordConfirmation && <p className="text-red-600">{errors.passwordConfirmation.message}</p>}
                {apiErrors.passwordConfirmation && <p className="text-red-600">{apiErrors.passwordConfirmation}</p>}
              </div>

              

              <div className="sm:col-span-3">
                <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  {...register('firstname')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.firstname && <p className="text-red-600">{errors.firstname.message}</p>}
                {apiErrors.firstname && <p className="text-red-600">{apiErrors.firstname}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="secondname" className="block text-sm font-medium leading-6 text-gray-900">Second Name</label>
                <input
                  type="text"
                  id="secondname"
                  {...register('secondname')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.secondname && <p className="text-red-600">{errors.secondname.message}</p>}
                {apiErrors.secondname && <p className="text-red-600">{apiErrors.secondname}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="cin" className="block text-sm font-medium leading-6 text-gray-900">CIN</label>
                <input
                  type="text"
                  id="cin"
                  {...register('cin')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.cin && <p className="text-red-600">{errors.cin.message}</p>}
                {apiErrors.cin && <p className="text-red-600">{apiErrors.cin}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">Address</label>
                <input
                  type="text"
                  id="address"
                  {...register('address')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.address && <p className="text-red-600">{errors.address.message}</p>}
                {apiErrors.address && <p className="text-red-600">{apiErrors.address}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="tele" className="block text-sm font-medium leading-6 text-gray-900">Telephone</label>
                <input
                  type="text"
                  id="tele"
                  {...register('tele')}
                  className="mt-2 block w-full px-3 py-1.5 text-gray-900 placeholder:text-gray-400 ring-1 ring-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
                {errors.tele && <p className="text-red-600">{errors.tele.message}</p>}
                {apiErrors.tele && <p className="text-red-600">{apiErrors.tele}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={() => closeModal('modalAdd')}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
