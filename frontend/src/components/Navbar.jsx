import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isWorkspacePage = location.pathname === '/workspace';

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
          <div className="flex items-center gap-6">
            <Link 
              to="/workspace" 
              className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Workspace
            </Link>
            {!isWorkspacePage && (
              <Link 
                to="/workspace" 
                className="inline-flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors bg-gray-900 text-white hover:bg-gray-800 h-8 px-4 shadow-sm"
              >
                Analyze Resume
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
