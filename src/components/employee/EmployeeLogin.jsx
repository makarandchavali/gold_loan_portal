import React, { useState } from 'react';
import { getAllEmployees } from '../../config/teamsData';

const EmployeeLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    employeeId: '',
    password: ''
  });
  const [error, setError] = useState('');

  const allEmployees = getAllEmployees();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find employee by ID
    const employee = allEmployees.find(emp => emp.id === credentials.employeeId);

    // Simple password check (in real app, use proper authentication)
    // Password format: emp123 (same for all employees for demo)
    if (employee && credentials.password === 'emp123') {
      localStorage.setItem('employeeData', JSON.stringify(employee));
      onLogin(employee);
    } else {
      setError('Invalid Employee ID or Password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
            <img 
            src="/img.png" 
            alt="Logo" 
            className="login-logo"
          />
          <h1>IIFL- Finance</h1>
          <h2>Employee Portal Login</h2>
          <p>Gold Loan Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={credentials.employeeId}
              onChange={handleChange}
              placeholder="e.g., emp1"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default EmployeeLogin;
