import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays } from 'date-fns';
import SuccessDialog from './SuccessDialog';
import axios from 'axios';

function ReservationForm({ selectedRoomId }) {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        tel: '',
        total_price: '',
        discount: '',
        room: selectedRoomId ? `/api/rooms/${selectedRoomId}` : '',
        user: '',
        start_date: '',
        end_date: '',
    });

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [bookingForSelf, setBookingForSelf] = useState(true); // State for booking mode

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            fetchUserData(token);
        } else {
            setIsAuthenticated(false);
        }
    }, []);


        const fetchUserData = async (token) => {
            try {
                const response = await axios.get('http://localhost:8000/api/user_info', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = response.data;
                console.log('User data:', userData); // Check this log
                setUserId(userData.id); // Ensure this matches your API response

                if (bookingForSelf) {
                    setFormData(prevData => ({
                        ...prevData,
                        firstname: userData.firstname || '',
                        lastname: userData.lastname || '',
                        email: userData.email || '',
                        tel: userData.telephone || '', // Update to match your API response
                        user: `/api/users/${userData.id}`,
                    }));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setIsAuthenticated(false); // Handle authentication errors
            }
        };

    const handleDateChange = (ranges) => {
        const { selection } = ranges;
        setDateRange([selection]);
        const startDate = selection.startDate.toISOString();
        const endDate = selection.endDate.toISOString();

        console.log("Selected Dates:", { startDate, endDate }); // Debug log

        setFormData(prevData => ({
            ...prevData,
            start_date: startDate,
            end_date: endDate,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleBookingModeChange = (e) => {
        const isSelfBooking = e.target.checked;
        setBookingForSelf(isSelfBooking);
        setFormData(prevData => ({
            ...prevData,
            user: isSelfBooking ? `/api/users/${userId}` : '', // Clear user ID if booking for someone else
        }));
    };

    const onSubmit = async (event) => {
            event.preventDefault();

            if (!isAuthenticated && bookingForSelf) {
                setDialogMessage('User is not authenticated. Please log in.');
                setIsDialogOpen(true);
                return;
            }

            if (bookingForSelf && !userId) {
                setDialogMessage('User ID is missing.');
                setIsDialogOpen(true);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                if (!token && bookingForSelf) {
                    throw new Error('No authentication token found');
                }

                const requestData = {
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    email: formData.email,
                    tel: formData.tel,
                    start_date: formData.start_date,
                    end_date: formData.end_date,
                    total_price: formData.total_price,
                    discount: formData.discount,
                    room: formData.room,
                    user: bookingForSelf ? `/api/users/${userId}` : '',
                    totalPrice: parseFloat(formData.total_price),
                };

                console.log("Sending request data:", requestData); // Debug log

                const response = await fetch('http://localhost:8000/api/reservations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestData),
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || 'Error creating reservation');
                }
                setDialogMessage('Reservation created successfully!');
                setIsDialogOpen(true);
            } catch (error) {
                setDialogMessage(`Error creating reservation: ${error.message}`);
                setIsDialogOpen(true);
            }
        };

    return (
        <div className="bg-white flex justify-center items-center min-h-screen">
            <div className="max-w-2xl w-full p-8 shadow-lg rounded-lg">
                <h1 className="text-center text-2xl font-bold mb-6">Reservation Form</h1>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="flex items-center mb-6">
                        <input
                            type="checkbox"
                            id="bookingForSelf"
                            checked={bookingForSelf}
                            onChange={handleBookingModeChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="bookingForSelf" className="ml-3 text-sm font-medium text-gray-700">
                            Booking for yourself
                        </label>
                    </div>

                    {!bookingForSelf && (
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstname"
                                    id="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastname"
                                    id="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
                                    Telephone
                                </label>
                                <input
                                    type="tel"
                                    name="tel"
                                    id="tel"
                                    value={formData.tel}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">
                            Date Range
                        </label>
                        <DateRangePicker
                            ranges={dateRange}
                            onChange={handleDateChange}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            months={2}
                            direction="horizontal"
                            rangeColors={['#4f46e5']}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            showDateDisplay={false}
                            inputRanges={[]}
                            staticRanges={[]}
                        />
                    </div>

                    <div className="mt-6">
                        <label htmlFor="total_price" className="block text-sm font-medium text-gray-700">
                            Total Price
                        </label>
                        <input
                            type="text"
                            name="total_price"
                            id="total_price"
                            value={formData.total_price}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="mt-6">
                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                            Discount
                        </label>
                        <input
                            type="text"
                            name="discount"
                            id="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-lg font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Reserve
                    </button>
                </form>
            </div>

            <SuccessDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                message={dialogMessage}
            />
        </div>
    );
}

export default ReservationForm;
