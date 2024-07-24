import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            setMessage('Error: Passwords do not match');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8000/api/reset-password', {
                newPassword: password,
                confirmation: confirmPassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
    
            setPassword('');
            setConfirmPassword('');
            setMessage('Password reset successful');
            console.log('Reset password response:', response);
            setTimeout(() => {
            navigate('/Login');
            }, 2000); // Wait 3 seconds before redirecting
        } catch (error) {
            if (error.response && error.response.data) {
                // Display the error message from the backend
                setMessage('Error: ' + (error.response.data.message || 'Error resetting password'));
                console.error('Reset password error:', error.response.data);
            } else {
                // Display a generic error message if the backend message is not available
                setMessage('Error: An unexpected error occurred. Please try again later.');
                console.error('Reset password error:', error.message);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Reset Password</h1>
                {message && (
                    <div className={`w-full max-w-md p-4 rounded ${message.includes('Error') ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`} role="alert">
                        <strong className="font-bold">{message.includes('Error') ? 'Error' : 'Success!'}</strong>
                        <span className="block sm:inline"> {message}</span>
                    </div>
                )}
                <form noValidate onSubmit={handleResetPassword}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">New Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                            className="form-input bg-gray-200 border border-gray-300 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                            className="form-input bg-gray-200 border border-gray-300 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-6 flex justify-between">
                        <button
                            type="submit"
                            className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Reset Password
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
