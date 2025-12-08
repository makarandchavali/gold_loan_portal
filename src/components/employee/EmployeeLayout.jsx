import React from 'react';
import { LogOut } from 'lucide-react';
import EmployeeDailyBusinessForm from './EmployeeDailyBusinessForm';

const EmployeeLayout = ({ employeeData, onLogout }) => {
  return (
    <div className="employee-layout">
      <header className="employee-header">
        <div className="employee-header-left">
            <img 
            src="/img.png" 
            alt="Logo" 
            className="header-logo"
          />
          <h1>IIFL- Finance Employee Portal</h1>
          <p>Daily Business Form</p>
        </div>
        <div className="employee-header-right">
          <div className="employee-profile">
            <span className="employee-name-display">{employeeData.name}</span>
            <span className="employee-id-display">{employeeData.id}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <main className="employee-main">
        <EmployeeDailyBusinessForm employeeData={employeeData} />
      </main>

      <footer className="employee-footer">
        <p>© 2025 India Infoline Gold Loan Digital Workflow System</p>
      </footer>
    </div>
  );
};

export default EmployeeLayout;
