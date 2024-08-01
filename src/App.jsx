import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import RiadsAdmin from './pages/RiadsAdmin'
import PasswordReset from './components/PasswordRequest/resetpassword';
import { ForgotPassword } from './components/PasswordRequest/ForgotPassword';

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
      <Route path='/Login' element={<Login/>}/>
      <Route path='/admin/Riads' element={<RiadsAdmin/>}/>
      {<Route path='/admin/Rooms' element={<RiadsAdmin/>}/> }
      <Route path='/forgotPassword' element={<ForgotPassword/>}/>
      <Route path='/test' element={<Test />}/>
      <Route path='/test2' element={<Test2/>}/>
      <Route path='/riad/:id' element={<RiadDetail />}/>
      <Route path='/forgotPassword' element={<ForgotPassword/>}/>
      <Route path="/password-reset" element={<PasswordReset />} />
    </Routes>
    </BrowserRouter>
    </OpenProvider>
    </QueryClientProvider>

    </>
  )
}

export default App
