import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import WorkspacePage from './pages/WorkspacePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            {/* Redirect legacy routes to workspace */}
            <Route path="/upload" element={<Navigate to="/workspace" replace />} />
            <Route path="/results" element={<Navigate to="/workspace" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
