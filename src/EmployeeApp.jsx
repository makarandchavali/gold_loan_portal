import React, { useState, useEffect } from 'react';
import EmployeeLogin from './components/employee/EmployeeLogin';
import EmployeeLayout from './components/employee/EmployeeLayout';

function EmployeeApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    const storedEmployee = localStorage.getItem('employeeData');
    if (storedEmployee) {
      const employee = JSON.parse(storedEmployee);
      setEmployeeData(employee);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (employee) => {
    setEmployeeData(employee);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeData');
    setEmployeeData(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <EmployeeLogin onLogin={handleLogin} />;
  }

  return <EmployeeLayout employeeData={employeeData} onLogout={handleLogout} />;
}

export default EmployeeApp;
