import React, { useState, useEffect } from 'react';
import Login from './components/manger/Login';
import MainLayout from './components/manger/MainLayout';

function ManagerApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [managerData, setManagerData] = useState(null);

  useEffect(() => {
    const storedManager = localStorage.getItem('managerData');
    if (storedManager) {
      const manager = JSON.parse(storedManager);
      setManagerData(manager);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (manager) => {
    setManagerData(manager);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('managerData');
    setManagerData(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return <MainLayout managerData={managerData} onLogout={handleLogout} />;
}

export default ManagerApp;
