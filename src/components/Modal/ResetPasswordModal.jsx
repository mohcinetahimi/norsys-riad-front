import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import apiClient from '../Admin/token/config'; // Adjust the path if necessary
import { useFlashMessage } from '../../contexts/FlashMessageContext';

const ResetPasswordModal = ({ isOpen, onClose, userId }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { showFlashMessage } = useFlashMessage();
  const [userInfo, setUserInfo] = useState({});

  // Fetch user info on component mount or when userId changes
  useEffect(() => {
    if (userId && isOpen) {
      fetchUserInfo(userId);
    }
  }, [userId, isOpen]);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      console.log("response", response.data);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      showFlashMessage('Failed to fetch user information.', 'error');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      // Prepare the user entity with the new password and other details
      const userEntity = {
        username: userInfo.username,
        email: userInfo.email,
        firstname: userInfo.firstname,
        secondname: userInfo.secondname,
        cin: userInfo.cin,
        address: userInfo.address,
        tele: userInfo.tele,
        imageUrl: userInfo.imageUrl,
        password: newPassword,  // Assuming 'password' is the field for new password
        confirmation: confirmation, // Confirmation field for password confirmation
      };

      // Send the request with the full user entity
      await apiClient.put(`/users/${userId}`, userEntity);

      // Handle successful response
      showFlashMessage('User information and password have been successfully updated.', 'success');
      onClose(); // Close the modal after successful submission
    } catch (err) {
      // Handle errors
      if (err.response && err.response.status === 401) {
        setErrors({ general: 'Unauthorized access. Please log in again.' });
      } else if (err.response && err.response.data) {
        setErrors(err.response.data); // Assuming error structure is `{ field: [message] }`
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
      showFlashMessage(errors.general || 'An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Reset Password for {userInfo.username}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.newPassword && (
              <div className="text-red-500 text-sm mt-1">{errors.newPassword[0]}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmation"
              type="password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.confirmation && (
              <div className="text-red-500 text-sm mt-1">{errors.confirmation[0]}</div>
            )}
          </div>
          {errors.general && <div className="text-red-500 text-sm mb-4">{errors.general}</div>}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? 'Sending...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ResetPasswordModal;
