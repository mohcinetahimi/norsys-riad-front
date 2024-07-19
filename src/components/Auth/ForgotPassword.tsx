import { useState } from 'react';
import * as Yup from 'yup';
import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';

const initialValues = {
  email: 'admin@demo.com',
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
});

// Define the requestPassword function
const requestPassword = async (email) => {
  const response = await fetch('/api/request-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to request password');
  }

  return response.json();
};

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(false);
      setTimeout(() => {
        requestPassword(values.email)
          .then(() => {
            setHasErrors(false);
            setLoading(false);
          })
          .catch(() => {
            setHasErrors(true);
            setLoading(false);
            setSubmitting(false);
            setStatus('The login detail is incorrect');
          });
      }, 1000);
    },
  });

  return (
    <form
      className='w-full'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        <h1 className='text-gray-900 font-bold mb-3'>Forgot Password?</h1>
        <div className='text-gray-500 font-semibold'>
          Enter your email to reset your password.
        </div>
      </div>

      {hasErrors === true && (
        <div className='mb-6 alert alert-danger'>
          <div className='text-red-600 font-bold'>
            Sorry, looks like there are some errors detected, please try again.
          </div>
        </div>
      )}

      {hasErrors === false && (
        <div className='mb-6 bg-blue-100 p-4 rounded'>
          <div className='text-blue-700'>Sent password reset. Please check your email.</div>
        </div>
      )}

      <div className='mb-6'>
        <label className='block text-gray-900 font-bold mb-2'>Email</label>
        <input
          type='email'
          placeholder=''
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white',
            { 'border-red-500': formik.touched.email && formik.errors.email },
            { 'border-green-500': formik.touched.email && !formik.errors.email }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='mt-2 text-red-600 text-sm'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
      </div>

      <div className='flex flex-wrap justify-center'>
        <button
          type='submit'
          id='kt_password_reset_submit'
          className='btn btn-primary bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          <span>Submit</span>
          {loading && (
            <span className='ml-2'>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ml-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_password_reset_form_cancel_button'
            className='btn btn-light bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            Cancel
          </button>
        </Link>
      </div>
    </form>
  );
}
