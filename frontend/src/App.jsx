import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import HRDashboard from './components/HRDashboard';
import ManagerDashboard from './components/ManagerDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'auth'

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white">
      {!user ? (
        // Unauthenticated Flows
        currentView === 'landing' ? (
          <LandingPage onGetStarted={() => setCurrentView('auth')} />
        ) : (
          <div className="min-h-screen flex flex-col">
            <header className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0e1626]">
              <button 
                onClick={() => setCurrentView('landing')} 
                className="text-blue-400 text-sm hover:underline flex items-center gap-1"
              >
                ← Back to Home
              </button>
            </header>
            <div className="flex-grow flex items-center justify-center p-6">
              <Login onLoginSuccess={(userData) => setUser(userData)} />
            </div>
          </div>
        )
      ) : (
        // Authenticated Role-Based Routing
        user.role === 'HR' ? (
          <HRDashboard user={user} onLogout={handleLogout} />
        ) : user.role === 'Manager' ? (
          <ManagerDashboard user={user} onLogout={handleLogout} />
        ) : (
          <EmployeeDashboard user={user} onLogout={handleLogout} />
        )
      )}
    </div>
  );
}