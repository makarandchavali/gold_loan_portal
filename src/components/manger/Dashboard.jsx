import React from 'react';
import { TrendingUp, Shield, AlertCircle, Users } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Today\'s Disbursements', value: '₹12.5L', icon: TrendingUp, color: '#10b981' },
    { title: 'Gold in Vault', value: '2,450g', icon: Shield, color: '#3b82f6' },
    { title: 'Pending Recoveries', value: '23', icon: AlertCircle, color: '#f59e0b' },
    { title: 'Customer Feedbacks', value: '8', icon: Users, color: '#8b5cf6' }
  ];

  return (
    <div className="dashboard">
      <h1>Gold Loan Operations Dashboard</h1>
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
                <Icon size={24} color={stat.color} />
              </div>
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn primary">New Loan Application</button>
          <button className="action-btn secondary">Verify Vault</button>
          <button className="action-btn secondary">View Pending Cases</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
