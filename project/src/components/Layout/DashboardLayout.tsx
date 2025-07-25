import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const { state } = useApp();

  if (!state.currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;