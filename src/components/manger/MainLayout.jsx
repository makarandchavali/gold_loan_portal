import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import Dashboard from './Dashboard'; // ADD THIS
import DailyBusinessForm from './DailyBusinessForm';
import GoldStockForm from './GoldStockForm';
import KYCComplianceForm from './KYCComplianceForm';
import LoanRecoveryForm from './LoanRecoveryForm';
import CustomerFeedbackForm from './CustomerFeedbackForm';

const MainLayout = ({ managerData, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeForm, setActiveForm] = useState('dashboard'); // CHANGED from 'daily-business' to 'dashboard'

  const forms = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠' }, // ADD THIS
    { id: 'daily-business', name: 'Daily Business Update', icon: '📊' },
    { id: 'gold-stock', name: 'Gold Stock Verification', icon: '🔒' },
    { id: 'kyc-compliance', name: 'KYC & Compliance', icon: '📋' },
    { id: 'loan-recovery', name: 'Loan Recovery', icon: '💰' },
    { id: 'customer-feedback', name: 'Customer Feedback', icon: '⭐' }
  ];

  const renderForm = () => {
    switch(activeForm) {
      case 'dashboard':
        return <Dashboard managerData={managerData} />; // ADD THIS
      case 'daily-business':
        return <DailyBusinessForm managerData={managerData} />;
      case 'gold-stock':
        return <GoldStockForm managerData={managerData} />;
      case 'kyc-compliance':
        return <KYCComplianceForm managerData={managerData} />;
      case 'loan-recovery':
        return <LoanRecoveryForm managerData={managerData} />;
      case 'customer-feedback':
        return <CustomerFeedbackForm managerData={managerData} />;
      default:
        return <Dashboard managerData={managerData} />; // CHANGED default
    }
  };

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <img 
  src="/IIFL logo.png" 
  alt="Logo" 
  className="sidebar-logo"
  style={{ width: "150px", height: "90px" }}
/>
          <h2>Portal</h2>
        </div>
        
        <nav className="sidebar-nav">
          {forms.map(form => (
            <button
              key={form.id}
              className={`nav-item ${activeForm === form.id ? 'active' : ''}`}
              onClick={() => setActiveForm(form.id)}
            >
              <span className="nav-icon">{form.icon}</span>
              <span className="nav-text">{form.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="manager-info">
            <p className="manager-name">{managerData.name}</p>
            <p className="manager-branch">{managerData.branch}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="top-bar-right">
            <span className="welcome-text">Welcome, {managerData.name}</span>
            <button className="logout-btn" onClick={onLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <div className="content-area">
          {renderForm()}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
