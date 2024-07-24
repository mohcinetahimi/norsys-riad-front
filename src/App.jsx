import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import RiadsAdmin from './pages/RiadsAdmin'
import { ForgotPassword } from './components/Auth/ForgotPassword';

import { OpenProvider } from './contexts/OpenContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


import './App.css'
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
      <Route path='/riad/:id' element={<RiadDetail />}/>
      <Route path='/forgotPassword' element={<ForgotPassword/>}/>
    </Routes>
    </BrowserRouter>
    </OpenProvider>
    </QueryClientProvider>

    </>
  )
}

export default App
