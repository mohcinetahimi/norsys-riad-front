// src/App.jsx
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import RiadsAdmin from './components/Admin/Riad/RiadsAdmin.jsx'
import PasswordReset from './components/PasswordRequest/resetpassword';
import { ForgotPassword } from './components/PasswordRequest/ForgotPassword';
import HomePage from "./pages/HomePage.jsx";
import RiadDetail from "./pages/RiadDetail.jsx";
// import AddRoom from "./components/Admin/Room/addroom.jsx";
import AddRiad from "./components/Admin/Riad/AddRiad.jsx";
import AdminLogin from "./components/Admin/Auth/AdminLogin.jsx";
import ListRooms from "./components/Admin/Room/ListRooms.jsx";
import ListUsers from "./components/Admin/Users/ListUsers.jsx";
import UserDetail from './components/Admin/Users/UserDetail.jsx';
import EditUser from './components/Admin/Users/EditUser.jsx';
import ProtectedRoute from './components/Admin/token/ProtectedRoute';
import { OpenProvider } from './contexts/OpenContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';



import './App.css'
import Test from './components/Test';
import Test2 from './components/Test2.jsx'
import HomePage from "./pages/HomePage.jsx";
import RiadDetail from "./pages/RiadDetail.jsx";
import Header from "./components/Riad/Header.jsx";
import RiadList from "./components/Riad/RiadList.jsx";
import Incentive from "./components/Riad/Incentive.jsx";
import Calendar from "./components/Reservation/Calendar.jsx";
import ReservationForm from './components/Reservation/ReservationForm.jsx';
import CalendarRes from "./components/Admin/Reservation/CalendarRes.jsx";


function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>

        <OpenProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<HomePage />}/>
              <Route path='/register' element={<Register/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/forgotPassword' element={<ForgotPassword/>}/>
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path='/admin' element={<AdminLogin/>}/> 
              <Route path="/cal" element={<CalendarRes />}/>
              <Route path='/calendar' element={<Calendar/>}/> 
              <Route  path='/resForm' element={<ReservationForm/>}/> 
              <Route path='/test' element={<Test />}/>
              <Route path='/test2' element={<Test2/>}/>

              {/* Protected Routes */}
              <Route path='/admin/riads' element={<ProtectedRoute element={RiadsAdmin} />} />
              <Route path='/riad/:id' element={<ProtectedRoute element={RiadDetail} />} />
              <Route path="/addRoom" element={<ProtectedRoute element={AddRoom} />} />
              <Route path="/addRiad" element={<ProtectedRoute element={AddRiad} />} />
             
              <Route path="/listRooms" element={<ProtectedRoute element={ListRooms} />} />
              <Route path="/listUsers" element={<ProtectedRoute element={ListUsers} />} />
              <Route path="/users/:userId" element={<ProtectedRoute element={UserDetail} />} />
              <Route path="/edit-user/:userId" element={<ProtectedRoute element={EditUser} />} />
            </Routes>
          </BrowserRouter>
        </OpenProvider>
      </QueryClientProvider>
    </>
  )
}

export default App;
