import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '../../assets/style/register.css';

// Import your image here
import registrationImage from '../../assets/mauro-lima-57JmCGaMlNw-unsplash.jpg'; 

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(8, 'Username must be at least 8 characters long')
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
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
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
    <div className="flex min-h-screen flex-col lg:flex-row overflow-hidden">
      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white overflow-auto">
        <div className="w-full max-w-4xl">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create your account
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
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

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field Group 1 */}
              <div>
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

              <div>
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

              {/* Field Group 2 */}
              <div>
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

              <div>
                <label htmlFor="secondname" className="block text-sm font-medium leading-6 text-gray-900">
                  Second Name
                </label>
                <div className="mt-2">
                  <input
                    id="secondname"
                    name="secondname"
                    type="text"
                    autoComplete="additional-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("secondname")}
                  />
                  {errors.secondname && <p className="mt-2 text-sm text-red-600">{errors.secondname.message}</p>}
                </div>
              </div>

              {/* Field Group 3 */}
              <div>
                <label htmlFor="cin" className="block text-sm font-medium leading-6 text-gray-900">
                  CIN
                </label>
                <div className="mt-2">
                  <input
                    id="cin"
                    name="cin"
                    type="text"
                    autoComplete="off"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("cin")}
                  />
                  {errors.cin && <p className="mt-2 text-sm text-red-600">{errors.cin.message}</p>}
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
      <label htmlFor="tele" className="block text-sm font-medium leading-6 text-gray-900">
        Telephone Number
      </label>
      <div className="mt-2 flex items-center border border-gray-300 rounded-md overflow-hidden">
        <PhoneInput
          defaultCountry="US"
          international
          id="tele"
          name="tele"
          value={watch('tele')}
          onChange={handlePhoneChange}
          className="flex-1 py-1.5 text-gray-900 placeholder:text-gray-400 ring-0 focus:ring-0 sm:text-sm sm:leading-6"
          style={{ border: 'none', outline: 'none' }}
        />
      </div>
      {errors.tele && <p className="mt-2 text-sm text-red-600">{errors.tele.message}</p>}
    </div>

              {/* Field Group 4 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("password")}
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="passwordConfirmation" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    type="password"
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("passwordConfirmation")}
                  />
                  {errors.passwordConfirmation && <p className="mt-2 text-sm text-red-600">{errors.passwordConfirmation.message}</p>}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                Already have an account? Login
              </Link>
              <button
                type="submit"
                className="inline-block rounded-md bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-indigo-600 ring-inset hover:ring-indigo-700 focus:ring-2 focus:ring-indigo-600"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative hidden lg:block lg:flex-1 overflow-auto">
        <img
          src={registrationImage}
          alt="Registration"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;











