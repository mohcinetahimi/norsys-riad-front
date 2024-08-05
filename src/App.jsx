// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PasswordReset from './components/PasswordRequest/resetpassword';
import { ForgotPassword } from './components/PasswordRequest/ForgotPassword';
import HomePage from "./pages/HomePage";
import RiadDetail from "./pages/RiadDetail";
import AddRiad from "./components/Admin/Riad/AddRiad";
import AdminLogin from "./components/Admin/Auth/AdminLogin";
import ListRooms from "./components/Admin/Room/ListRooms";
import ListUsers from "./components/Admin/Users/ListUsers";
import UserDetail from './components/Admin/Users/UserDetail';
import EditUser from './components/Admin/Users/EditUser';
import ProtectedRoute from './components/Admin/token/ProtectedRoute';
import { OpenProvider } from './contexts/OpenContext';
import { FlashMessageProvider } from './contexts/FlashMessageContext'; // Import FlashMessageProvider
import AddRoom from './components/Admin/Room/AddRoom';
import Table from './components/Admin/Room/Roomtable';
import Unauthorized from './components/Admin/token/Unauthorized';
import Table2 from './components/Admin/Riad/Riadtable';
import ProfilePage from './components/Client/Profile';

import './App.css';
import Test from './components/Test';
import Test2 from './components/Test2';
import Header from "./components/Riad/Header";
import RiadList from "./components/Riad/RiadList";
import Incentive from "./components/Riad/Incentive";
import Calendar from "./components/Reservation/Calendar";
import ReservationForm from './components/Reservation/ReservationForm';
import CalendarRes from "./components/Admin/Reservation/CalendarRes";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <OpenProvider>
        <FlashMessageProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path='/forgotPassword' element={<ForgotPassword />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path='/admin' element={<AdminLogin />} />
              <Route path="/cal" element={<CalendarRes />} />
              <Route path='/calendar' element={<Calendar />} />
              <Route path='/resForm' element={<ReservationForm />} />
              <Route path='/test' element={<Test />} />
              <Route path='/test2' element={<Test2 />} />

              {/* Protected Routes */}
              <Route path='/admin/riads' element={<ProtectedRoute element={Table2} requiredRole="ROLE_ADMIN" />} />
              <Route path='/profile' element={<ProtectedRoute element={ProfilePage} requiredRole="ROLE_ADMIN" />} />
              <Route path='/riad/:id' element={<ProtectedRoute element={RiadDetail} requiredRole="ROLE_ADMIN" />} />
              <Route path="/addRoom" element={<ProtectedRoute element={AddRoom} requiredRole="ROLE_ADMIN" />} />
              <Route path="/addRiad" element={<ProtectedRoute element={AddRiad} requiredRole="ROLE_ADMIN" />} />
              <Route path="/listRooms" element={<ProtectedRoute element={Table} requiredRole="ROLE_ADMIN" />} />
              <Route path="/listRiads" element={<ProtectedRoute element={Table2} requiredRole="ROLE_ADMIN" />} />
              <Route path="/listUsers" element={<ProtectedRoute element={ListUsers} requiredRole="ROLE_ADMIN" />} />
              <Route path="/users/:userId" element={<ProtectedRoute element={UserDetail} requiredRole="ROLE_ADMIN" />} />
              <Route path="/edit-user/:userId" element={<ProtectedRoute element={EditUser} requiredRole="ROLE_ADMIN" />} />
              
              {/* Unauthorized Route */}
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </BrowserRouter>
        </FlashMessageProvider>
      </OpenProvider>
    </QueryClientProvider>
  );
}

export default App;
