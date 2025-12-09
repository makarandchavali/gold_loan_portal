import React, { useState, useEffect } from 'react';

const Dashboard = ({ managerData }) => {
  const [stats, setStats] = useState({
    totalAssignments: 0,
    pendingForms: 0,
    completedToday: 0,
    totalEmployees: 16 // 4 teams × 4 employees
  });

  const [recentAssignments, setRecentAssignments] = useState([
    {
      id: 'ASG001',
      formType: 'Daily Business Update',
      assignedTo: '5 Employees',
      date: '2025-12-09',
      status: 'Pending',
      assignedAt: '10:30 AM'
    },
    {
      id: 'ASG002',
      formType: 'Gold Stock Verification',
      assignedTo: '3 Employees',
      date: '2025-12-09',
      status: 'Completed',
      assignedAt: '09:15 AM'
    },
    {
      id: 'ASG003',
      formType: 'KYC & Compliance',
      assignedTo: '8 Employees',
      date: '2025-12-08',
      status: 'In Progress',
      assignedAt: '04:45 PM'
    }
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { class: 'status-pending', icon: '⏳' },
      'Completed': { class: 'status-completed', icon: '✅' },
      'In Progress': { class: 'status-progress', icon: '🔄' }
    };
    const config = statusConfig[status] || statusConfig['Pending'];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {status}
      </span>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div>
          <h1>Welcome back, {managerData.name}! </h1>
        </div>
        <div className="dashboard-date">
          <span className="date-label">Today</span>
          <span className="date-value">{new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalAssignments}</div>
            <div className="stat-label">Total Assignments</div>
          </div>
        </div>

        <div className="stat-card yellow">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingForms}</div>
            <div className="stat-label">Pending Forms</div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completedToday}</div>
            <div className="stat-label">Completed Today</div>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalEmployees}</div>
            <div className="stat-label">Total Employees</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <div className="quick-action-card">
            <div className="action-icon">📊</div>
            <h3>Daily Business</h3>
            <p>Assign daily business update form</p>
          </div>
          <div className="quick-action-card">
            <div className="action-icon">🔒</div>
            <h3>Gold Stock</h3>
            <p>Verify vault inventory</p>
          </div>
          <div className="quick-action-card">
            <div className="action-icon">📋</div>
            <h3>KYC Check</h3>
            <p>Compliance verification</p>
          </div>
          <div className="quick-action-card">
            <div className="action-icon">💰</div>
            <h3>Loan Recovery</h3>
            <p>Collection status tracking</p>
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="recent-assignments-section">
        <h2>Recent Assignments</h2>
        <div className="assignments-table">
          <table>
            <thead>
              <tr>
                <th>Assignment ID</th>
                <th>Form Type</th>
                <th>Assigned To</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAssignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td><strong>{assignment.id}</strong></td>
                  <td>{assignment.formType}</td>
                  <td>{assignment.assignedTo}</td>
                  <td>{assignment.date}</td>
                  <td>{assignment.assignedAt}</td>
                  <td>{getStatusBadge(assignment.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Branch Info */}
      <div className="branch-info-card">
        <h3>📍 Branch Information</h3>
        <div className="branch-details">
          <div className="branch-detail-item">
            <span className="detail-label">Branch:</span>
            <span className="detail-value">{managerData.branch}</span>
          </div>
          <div className="branch-detail-item">
            <span className="detail-label">Manager ID:</span>
            <span className="detail-value">{managerData.id}</span>
          </div>
          <div className="branch-detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{managerData.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
