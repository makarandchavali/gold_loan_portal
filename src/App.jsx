import React from 'react';
import './App.css';
import ManagerApp from './ManagerApp';
import EmployeeApp from './EmployeeApp';

function App() {
  // Simple router based on URL path
  const path = window.location.pathname;

  if (path === '/employee' || path === '/employee/') {
    return <EmployeeApp />;
  }

  // Default to Manager portal
  return <ManagerApp />;
}

export default App;
