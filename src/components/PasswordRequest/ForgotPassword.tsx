import { useState } from 'react';
import * as Yup from 'yup';
import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';

const initialValues = {
  email: '',
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .min(3, 'Email must be at least 3 characters')
    .max(50, 'Email must be at most 50 characters')
    .required('Email is required'),
});

// Define the requestPassword function using Axios
const requestPassword = async (email: string) => {
  try {
    const response = await axios.post('http://localhost:8000/api/password-reset-request', { email });
    return response.data;
  } catch (error) {
    // Throw error message from the server response if available
    const errorMessage = error.response?.data?.message || 'Failed to request password';
    throw new Error(errorMessage);
  }
};

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(false);
      setErrorMessage('');
      setSuccessMessage('');
      setSubmitted(true); // Set to true to show messages

      requestPassword(values.email)
        .then(() => {
          setSuccessMessage('Password reset link has been sent. Please check your email.');
          setLoading(false);
        })
        .catch((error) => {
          setHasErrors(true);
          setErrorMessage(error.message || 'An unexpected error occurred');
          setLoading(false);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Forgot Password</h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email address to reset your password.
        </p>

        {submitted && hasErrors && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        )}

        {submitted && !hasErrors && successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        )}

        <form noValidate onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="off"
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-input bg-gray-200 border border-gray-300 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500',
                { 'border-red-500': formik.touched.email && formik.errors.email },
                { 'border-green-500': formik.touched.email && !formik.errors.email }
              )}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="mt-2 text-red-600 text-sm">
                <span role="alert">{formik.errors.email}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-between">
            <button
              type="submit"
              className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? (
                <>
                  Submitting
                  <span className="ml-2 spinner-border spinner-border-sm align-middle"></span>
                </>
              ) : (
                'Submit'
              )}
            </button>
            <Link to="/Login">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 ml-4"
                disabled={formik.isSubmitting || !formik.isValid}
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
