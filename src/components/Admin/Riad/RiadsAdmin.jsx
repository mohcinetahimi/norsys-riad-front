import { Fragment, useEffect } from 'react';

import Table from '../Tables/Riadtable';
import { useNavigate } from 'react-router-dom';
import Navbar from '../pages/navbar'; // Import the Navbar component

export default function Riads() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token_admin');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <>
      <div className="min-h-full">
        <Navbar /> {/* Add the Navbar component here */}

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{/* Your content */}</div>
        </main>
      </div>
      <Table />
    </>
  );
}
