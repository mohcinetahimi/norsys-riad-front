import React, { useState } from 'react';
import AvailabilityChecker from '../components/Reservation/AvailabilityChecker';
import ListRoomsClient from '../components/Reservation/ListRoomsClient';

export default function SearchAvailability() {
    const [rooms, setRooms] = useState([]);
  return (
    <div>
        <AvailabilityChecker setRooms={setRooms} />
        <ListRoomsClient rooms={rooms} />
      </div>
  )
}
