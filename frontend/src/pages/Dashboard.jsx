import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <h2 className="text-xl font-semibold text-blue-700">Welcome, {user?.name}!</h2>
          <p className="text-blue-600">You are logged in as <span className="font-bold">{user?.role}</span></p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">My Profile</h3>
            <p className="text-gray-600">Email: {user?.email}</p>
          </div>
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">Account Status</h3>
            <p className="text-green-600 font-semibold">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
