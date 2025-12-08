import React, { useState } from 'react';
import { sendToN8N } from '../../config/n8nConfig';
import { teamsData, getAllEmployees } from '../../config/teamsData';

const DailyBusinessForm = ({ managerData }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    dailyTarget: '',
    selectedEmployees: []
  });

  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const allEmployees = getAllEmployees();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        selectedEmployees: allEmployees.map(emp => emp.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedEmployees: []
      }));
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    setFormData(prev => {
      const isSelected = prev.selectedEmployees.includes(employeeId);
      const newSelected = isSelected
        ? prev.selectedEmployees.filter(id => id !== employeeId)
        : [...prev.selectedEmployees, employeeId];
      
      setSelectAll(newSelected.length === allEmployees.length);
      
      return {
        ...prev,
        selectedEmployees: newSelected
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.selectedEmployees.length === 0) {
      setSubmitStatus({ type: 'error', message: 'Please select at least one employee' });
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    const selectedEmployeesData = allEmployees.filter(emp => 
      formData.selectedEmployees.includes(emp.id)
    );

    const dataToSend = {
      formType: 'daily-business',
      managerDetails: {
        managerId: managerData.id,
        managerName: managerData.name,
        branch: managerData.branch,
        email: managerData.email,
        date: formData.date
      },
      assignmentDetails: {
        date: formData.date,
        dailyTarget: formData.dailyTarget
      },
      employees: selectedEmployeesData,
      assignedAt: new Date().toISOString()
    };

    const result = await sendToN8N(dataToSend);

    setLoading(false);

    if (result.success) {
      setSubmitStatus({ 
        type: 'success', 
        message: `✅ Daily Business Form assigned to ${selectedEmployeesData.length} employee(s)!` 
      });
      
      setTimeout(() => {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          dailyTarget: '',
          selectedEmployees: []
        });
        setSelectAll(false);
        setSubmitStatus(null);
      }, 3000);
    } else {
      setSubmitStatus({ 
        type: 'error', 
        message: `Error: ${result.error}` 
      });
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>📊 Daily Business Update - Assignment</h1>
        <p>Assign daily business form to employees and set target</p>
      </div>

      {submitStatus && (
        <div className={`alert alert-${submitStatus.type}`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        {/* Manager Details - Auto Filled (Read Only) */}
        <div className="form-section locked-section">
          <h2>👤 Manager Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Manager Name</label>
              <input
                type="text"
                value={managerData.name}
                disabled
                className="locked-input"
              />
            </div>
            <div className="form-group">
              <label>Branch</label>
              <input
                type="text"
                value={managerData.branch}
                disabled
                className="locked-input"
              />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Employee Selection - Teams */}
        <div className="form-section">
          <div className="section-header">
            <h2>👥 Select Employees (Team-wise)</h2>
            <label className="select-all-label">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <span>Select All Employees</span>
            </label>
          </div>

          <div className="teams-grid">
            {teamsData.map(team => (
              <div key={team.teamId} className="team-card">
                <h3>{team.teamName}</h3>
                <div className="employees-list">
                  {team.employees.map(employee => (
                    <label key={employee.id} className="employee-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.selectedEmployees.includes(employee.id)}
                        onChange={() => handleEmployeeSelect(employee.id)}
                      />
                      <div className="employee-info">
                        <span className="employee-name">{employee.name}</span>
                        <span className="employee-phone">{employee.phone}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="selection-summary">
            <p><strong>Selected:</strong> {formData.selectedEmployees.length} / {allEmployees.length} employees</p>
          </div>
        </div>

        {/* Business Metrics & Targets - As per Image */}
        <div className="form-section">
          <h2>📊 Business Metrics & Targets</h2>
          <p className="section-note">
            <em>Note: Business Metrics will be filled by employees. Manager sets the Daily Target below.</em>
          </p>

          <div className="metrics-container">
            {/* Business Metrics */}
            <div className="metrics-group">
              <h3>Business Metrics</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>New Gold Loans Disbursed</label>
                  <input type="number" disabled placeholder="Filled by employee" />
                </div>
                <div className="form-group">
                  <label>Total Disbursement Value (₹)</label>
                  <input type="number" disabled placeholder="Filled by employee" />
                </div>
                <div className="form-group">
                  <label>Renewals Completed</label>
                  <input type="number" disabled placeholder="Filled by employee" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Customer Walk-ins</label>
                  <input type="number" disabled placeholder="Filled by employee" />
                </div>
                <div className="form-group">
                  <label>Leads Followed Up Today</label>
                  <input type="number" disabled placeholder="Filled by employee" />
                </div>
                <div className="form-group">
                  <label>Conversions from Leads</label>
                  <input type="number" disabled placeholder="Filled by employee" />
                </div>
              </div>
            </div>

            {/* Targets */}
            <div className="metrics-group">
              <h3>Targets</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Daily Target (₹) *</label>
                  <input 
                    type="number" 
                    name="dailyTarget"
                    value={formData.dailyTarget} 
                    onChange={handleChange}
                    placeholder="Enter daily target (e.g., 300000)"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Achievement (₹)</label>
                  <input type="number" disabled placeholder="Filled by employee" />
                </div>
                <div className="form-group">
                  <label>Achievement %</label>
                  <input type="text" disabled placeholder="0.00%" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? '📤 Assigning...' : '✅ Assign Form to Selected Employees'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyBusinessForm;
