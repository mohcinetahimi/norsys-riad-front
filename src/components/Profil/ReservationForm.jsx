import React, { useState } from 'react';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays } from 'date-fns';
import SuccessDialog from './SuccessDialog'; // Adjust the path as necessary

function ReservationForm({ selectedRoomId }) {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        tel: '',
        total_price: '',
        discount: '',
        room: selectedRoomId ? `/api/rooms/${selectedRoomId}` : '', // Format room field as URL
        user: '/api/users/2', // Adjust as necessary
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

    const handleDateChange = (ranges) => {
        const { selection } = ranges;
        setDateRange([selection]);
        setFormData(prevData => ({
            ...prevData,
            start_date: selection.startDate.toISOString(),
            end_date: selection.endDate.toISOString(),
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
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
                user: formData.user,
                totalPrice: parseFloat(formData.total_price), // Assuming totalPrice is a number
            };

            console.log("Sending request data:", requestData);

            const response = await fetch('http://localhost:8000/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>

                    <div className="mt-6">
                        <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="firstname"
                                id="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="lastname"
                                id="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <div className="mt-1">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
                            Telephone
                        </label>
                        <div className="mt-1">
                            <input
                                type="tel"
                                name="tel"
                                id="tel"
                                value={formData.tel}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

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
                        <div className="mt-1">
                            <input
                                type="text"
                                name="total_price"
                                id="total_price"
                                value={formData.total_price}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                            Discount
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="discount"
                                id="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
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
