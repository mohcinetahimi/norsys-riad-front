import React, { useState } from 'react';
import axios from 'axios';

const AvailabilityChecker = ({ setRooms }) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);

  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8000/api/rooms/available/${checkInDate}/${checkOutDate}/${guests}`);
      setRooms(response.data);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  return (
    <div className="w-3/4 max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <form className="flex flex-row" onSubmit={handleCheckAvailability}>
        <div className="mb-4 p-2">
          <label className="block text-gray-700 mb-2" htmlFor="check-in-date">Check-In Date</label>
          <input
            type="date"
            id="check-in-date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4 p-2">
          <label className="block text-gray-700 mb-2" htmlFor="check-out-date">Check-Out Date</label>
          <input
            type="date"
            id="check-out-date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4 p-2">
          <label className="block text-gray-700 mb-2" htmlFor="guests">Number of Guests</label>
          <input
            type="number"
            id="guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            min="1"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Check Availability</button>
      </form>
    </div>
  );
};

export default AvailabilityChecker;
