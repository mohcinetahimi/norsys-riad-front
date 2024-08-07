// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ReservationForm = () => {
//     const [rooms, setRooms] = useState([]);
//     const [selectedRooms, setSelectedRooms] = useState([]);
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [userId, setUserId] = useState('');
//     const [discount, setDiscount] = useState('');

//     useEffect(() => {
//         // Fetch available rooms
//         axios.get('/api/rooms')
//             .then(response => {
//                 console.log(response.data); // Check the structure of the response
//                 setRooms(response.data);
//             })
//             .catch(error => {
//                 console.error('There was an error fetching the rooms!', error);
//             });
//     }, []);

//     const handleRoomSelect = (room) => {
//         setSelectedRooms([...selectedRooms, room]);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         // Create the Reservation first
//         const reservationData = {
//             startDate,
//             endDate,
//             userId,
//             discount
//         };

//         axios.post('/api/reservations', reservationData)
//             .then(response => {
//                 const reservationId = response.data['@id']; // Extract the reservation ID
//                 // Then create RoomReserved entries
//                 selectedRooms.forEach(room => {
//                     const roomReservedData = {
//                         reservation: reservationId,
//                         room: room['@id'], // Assuming room has an @id from API response
//                         price: room.price.toString() // Convert price to string if needed
//                     };

//                     axios.post('/api/room_reserveds', roomReservedData)
//                         .then(res => {
//                             console.log('Room reservation created successfully:', res.data);
//                         })
//                         .catch(err => {
//                             console.error('Error creating room reservation:', err);
//                         });
//                 });

//                 alert('Reservation created successfully!');
//             })
//             .catch(error => {
//                 console.error('There was an error creating the reservation!', error);
//             });
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <div>
//                 <label>Start Date:</label>
//                 <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
//             </div>
//             <div>
//                 <label>End Date:</label>
//                 <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
//             </div>
//             <div>
//                 <label>User ID:</label>
//                 <input type="number" value={userId} onChange={e => setUserId(e.target.value)} required />
//             </div>
//             <div>
//                 <label>Discount:</label>
//                 <input type="text" value={discount} onChange={e => setDiscount(e.target.value)} required />
//             </div>
//             <div>
//                 <label>Available Rooms:</label>
//                 <ul>
//                     {Array.isArray(rooms) && rooms.map(room => (
//                         <li key={room['@id']}>
//                             {room.name} - ${room.price}
//                             <button type="button" onClick={() => handleRoomSelect(room)}>Select</button>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//             <button type="submit">Make Reservation</button>
//         </form>
//     );
// };

// export default ReservationForm;
