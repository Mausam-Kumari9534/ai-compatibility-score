import React, { useContext } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isWorkspacePage = location.pathname === '/workspace';
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-gray-900 hover:opacity-80 transition-opacity">
              <Briefcase className="h-5 w-5 text-indigo-600" />
              <span className="font-semibold text-[15px] tracking-tight">MatchAI</span>
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link 
              to="/workspace" 
              className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors hidden sm:block"
            >
              Workspace
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:block">{user.fullName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block">Logout</span>
                </button>
                {!isWorkspacePage && (
                  <Link 
                    to="/workspace" 
                    className="inline-flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 h-8 px-4 shadow-sm"
                  >
                    Go to Workspace
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? "inline-flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors bg-gray-900 text-white hover:bg-gray-800 h-8 px-4 shadow-sm"
                      : "text-[14px] font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  }
                >
                  Log in
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className={({ isActive }) =>
                    isActive
                      ? "inline-flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors bg-gray-900 text-white hover:bg-gray-800 h-8 px-4 shadow-sm"
                      : "text-[14px] font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  }
                >
                  Sign up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
