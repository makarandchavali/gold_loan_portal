import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Mock manager database (in real app, this would be from backend/n8n)
  const managers = [
    {
      id: 'MGR001',
      username: 'rajesh.kumar',
      password: 'manager123',
      name: 'Rajesh Kumar',
      branch: 'Mumbai Central',
      email: 'rajesh.kumar@indiainfoline.com',
      phone: '+919876543210'
    },
    {
      id: 'MGR002',
      username: 'priya.sharma',
      password: 'manager123',
      name: 'Priya Sharma',
      branch: 'Delhi North',
      email: 'priya.sharma@indiainfoline.com',
      phone: '+919876543211'
    }
  ];

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
    
    const manager = managers.find(
      m => m.username === credentials.username && m.password === credentials.password
    );

    if (manager) {
      // Store manager details in localStorage
      localStorage.setItem('managerData', JSON.stringify(manager));
      onLogin(manager);
    } else {
      setError('Invalid username or password');
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
          <h1>IIFL-Finance</h1>
          <h2>Manager Portal Login</h2>
          <p>Gold Loan Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your username"
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

export default Login;
