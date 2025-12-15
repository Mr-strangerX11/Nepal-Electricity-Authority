import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBolt, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <FaBolt />
            <span>NEA Connection System</span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/tracker" className="hover:text-blue-200 transition">
                  My Applications
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-200 transition">
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <FaUser />
                  <span>{user.first_name}</span>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
                  >
                    <FaSignOutAlt className="inline mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
