import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import RiadsAdmin from './pages/RiadsAdmin'
import { ForgotPassword } from './components/Auth/ForgotPassword';

import { OpenProvider } from './contexts/OpenContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


import './App.css'
import Test from './components/Test';

function App() {
  const queryClient = new QueryClient();

  return (
    <>
        <QueryClientProvider client={queryClient}>
    <OpenProvider>
    <BrowserRouter>
    <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/admin/Riads' element={<RiadsAdmin/>}/>
      {<Route path='/admin/Rooms' element={<RiadsAdmin/>}/> }
      <Route path='/forgotPassword' element={<ForgotPassword/>}/>
      <Route path='/test' element={<Test />}/>
    </Routes>
    </BrowserRouter>
    </OpenProvider>
    </QueryClientProvider>

    </>
  )
}

export default App
