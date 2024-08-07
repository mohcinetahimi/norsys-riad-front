// import React, { useState } from 'react';
// import 'react-date-range/dist/styles.css'; // main style file
// import 'react-date-range/dist/theme/default.css'; // theme css file
// import { DateRangePicker } from 'react-date-range';
// import { addDays } from 'date-fns';

// const CalendarComponent = () => {
//   const [state, setState] = useState([
//     {
//       startDate: new Date(),
//       endDate: addDays(new Date(), 7),
//       key: 'selection'
//     }
//   ]);

//   const handleSelect = (ranges) => {
//     setState([ranges.selection]);
//   };

//   const handleSubmit = () => {
//     console.log('Selected ranges:', state);
//     // You can replace the above console.log with your desired function to send the selected ranges
//   };

//   return (
    
//     <div className="calendar-container">
//       <DateRangePicker
//         className="mx-auto flex flex-col sm:flex-row"
//         ranges={state}
//         minDate={new Date()}
//         moveRangeOnFirstSelection={false}
//         editableDateInputs={true}
//         onChange={handleSelect}
//       />
//       <button 
//         onClick={handleSubmit} 
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         Submit Date Range
//       </button>
//     </div>
//   );
// };

// export default CalendarComponent;
