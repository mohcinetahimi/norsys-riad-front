import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(10, 'Username must be at least 10 characters long')
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{6,}$/,
      'Username must contain at least one uppercase letter, one number, and one symbol'
    ),
  email: yup.string().required('Email is required').email('Email is invalid'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{6,}$/,
      'Password must contain at least one uppercase letter, one number, and one symbol'
    ),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
  firstname: yup.string().required('First name is required'),
  secondname: yup.string().required('Second name is required'),
  cin: yup.string().required('CIN is required'),
  address: yup.string().required('Address is required'),
  tele: yup
    .string()
    .required('Telephone number is required')
    .test('is-valid-phone', 'Telephone number is invalid', (value) => {
      if (value) {
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber ? phoneNumber.isValid() : false;
      }
      return false;
    })
});

const Register = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    try {
      const response = await axios.post('http://localhost:8000/api/register', data);
      setErrorMessage(''); // Clear error message
      setSuccessMessage('Registration successful! You will be redirected shortly.');
      setIsRedirecting(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Wait 2 seconds before redirecting
    } catch (error) {
      setSuccessMessage(''); // Clear success message
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  // Handle phone number input change
  const handlePhoneChange = (value) => {
    setValue('tele', value);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Success:</strong>
              <span className="block sm:inline"> {successMessage}</span>
            </div>
          )}

          <div className="flex flex-wrap justify-between space-y-6 sm:space-y-0">
            <div className="w-full sm:w-1/2 sm:pr-3">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("username")}
                />
                {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
              </div>
            </div>
            <div className="w-full sm:w-1/2 sm:pl-3">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("email")}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between space-y-6 sm:space-y-0">
            <div className="w-full sm:w-1/2 sm:pr-3">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("password")}
                />
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
              </div>
            </div>
            <div className="w-full sm:w-1/2 sm:pl-3">
              <label htmlFor="password-confirmation" className="block text-sm font-medium leading-6 text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="passwordConfirmation"
                  id="password-confirmation"
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("passwordConfirmation")}
                />
                {errors.passwordConfirmation && <p className="mt-2 text-sm text-red-600">{errors.passwordConfirmation.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between space-y-6 sm:space-y-0">
            <div className="w-full sm:w-1/2 sm:pr-3">
              <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("firstname")}
                />
                {errors.firstname && <p className="mt-2 text-sm text-red-600">{errors.firstname.message}</p>}
              </div>
            </div>
            <div className="w-full sm:w-1/2 sm:pl-3">
              <label htmlFor="secondname" className="block text-sm font-medium leading-6 text-gray-900">
                Second Name
              </label>
              <div className="mt-2">
                <input
                  id="secondname"
                  name="secondname"
                  type="text"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("secondname")}
                />
                {errors.secondname && <p className="mt-2 text-sm text-red-600">{errors.secondname.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between space-y-6 sm:space-y-0">
            <div className="w-full sm:w-1/2 sm:pr-3">
              <label htmlFor="cin" className="block text-sm font-medium leading-6 text-gray-900">
                CIN
              </label>
              <div className="mt-2">
                <input
                  id="cin"
                  name="cin"
                  type="text"
                  autoComplete="cin"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("cin")}
                />
                {errors.cin && <p className="mt-2 text-sm text-red-600">{errors.cin.message}</p>}
              </div>
            </div>
            <div className="w-full sm:w-1/2 sm:pl-3">
              <label htmlFor="tele" className="block text-sm font-medium leading-6 text-gray-900">
                Telephone
              </label>
              <div className="mt-2">
                <PhoneInput
                  id="tele"
                  name="tele"
                  value=""
                  onChange={handlePhoneChange}
                  defaultCountry="MA" // Default country code, you can change this
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.tele && <p className="mt-2 text-sm text-red-600">{errors.tele.message}</p>}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
              Address
            </label>
            <div className="mt-2">
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="address"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("address")}
              />
              {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isRedirecting}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign up
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
