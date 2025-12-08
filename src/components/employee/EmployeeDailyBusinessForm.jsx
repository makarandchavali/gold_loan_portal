import React, { useState, useEffect } from 'react';
import { sendToN8N } from '../../config/n8nConfig';

const EmployeeDailyBusinessForm = ({ employeeData }) => {
  // In real app, this would come from n8n/database with the manager's assigned target
  const [assignmentData, setAssignmentData] = useState({
    date: new Date().toISOString().split('T')[0],
    dailyTarget: '300000', // This comes from manager
    managerName: 'Rajesh Kumar',
    branch: 'Mumbai Central'
  });

  const [formData, setFormData] = useState({
    newLoans: '',
    totalDisbursement: '',
    renewals: '',
    walkIns: '',
    leadsFollowedUp: '',
    conversions: '',
    achievement: ''
  });

  const [achievementPercent, setAchievementPercent] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Auto-calculate Achievement %
  useEffect(() => {
    const target = parseFloat(assignmentData.dailyTarget) || 0;
    const achieved = parseFloat(formData.achievement) || 0;
    
    if (target > 0) {
      const percent = ((achieved / target) * 100).toFixed(2);
      setAchievementPercent(percent);
    } else {
      setAchievementPercent('0.00');
    }
  }, [formData.achievement, assignmentData.dailyTarget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    const dataToSend = {
      formType: 'daily-business-submission',
      employeeDetails: {
        employeeId: employeeData.id,
        employeeName: employeeData.name,
        employeePhone: employeeData.phone,
        employeeEmail: employeeData.email,
        teamId: employeeData.teamId,
        teamName: employeeData.teamName
      },
      assignmentDetails: {
        date: assignmentData.date,
        dailyTarget: assignmentData.dailyTarget,
        managerName: assignmentData.managerName,
        branch: assignmentData.branch
      },
      businessMetrics: {
        newLoans: formData.newLoans,
        totalDisbursement: formData.totalDisbursement,
        renewals: formData.renewals,
        walkIns: formData.walkIns,
        leadsFollowedUp: formData.leadsFollowedUp,
        conversions: formData.conversions
      },
      targets: {
        dailyTarget: assignmentData.dailyTarget,
        achievement: formData.achievement,
        achievementPercent: achievementPercent
      },
      submittedAt: new Date().toISOString()
    };

    const result = await sendToN8N(dataToSend);

    setLoading(false);

    if (result.success) {
      setSubmitStatus({ 
        type: 'success', 
        message: '✅ Daily Business Form submitted successfully! Manager has been notified.' 
      });
      
      setTimeout(() => {
        setFormData({
          newLoans: '',
          totalDisbursement: '',
          renewals: '',
          walkIns: '',
          leadsFollowedUp: '',
          conversions: '',
          achievement: ''
        });
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
    <div className="employee-form-container">
      <div className="form-header">
        <h1>📊 Daily Business Update Form</h1>
        <p>Fill in your daily business metrics</p>
      </div>

      {submitStatus && (
        <div className={`alert alert-${submitStatus.type}`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        {/* Assignment Info - Read Only */}
        <div className="form-section locked-section">
          <h2>📋 Assignment Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Manager Name</label>
              <input
                type="text"
                value={assignmentData.managerName}
                disabled
                className="locked-input"
              />
            </div>
            <div className="form-group">
              <label>Branch</label>
              <input
                type="text"
                value={assignmentData.branch}
                disabled
                className="locked-input"
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="text"
                value={assignmentData.date}
                disabled
                className="locked-input"
              />
            </div>
          </div>
        </div>

        {/* Business Metrics - Editable by Employee */}
        <div className="form-section">
          <h2>📊 Business Metrics</h2>

          <div className="form-row">
            <div className="form-group">
              <label>New Gold Loans Disbursed *</label>
              <input
                type="number"
                name="newLoans"
                value={formData.newLoans}
                onChange={handleChange}
                placeholder="e.g., 5"
                required
              />
            </div>
            <div className="form-group">
              <label>Total Disbursement Value (₹) *</label>
              <input
                type="number"
                name="totalDisbursement"
                value={formData.totalDisbursement}
                onChange={handleChange}
                placeholder="e.g., 250000"
                required
              />
            </div>
            <div className="form-group">
              <label>Renewals Completed *</label>
              <input
                type="number"
                name="renewals"
                value={formData.renewals}
                onChange={handleChange}
                placeholder="e.g., 3"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Customer Walk-ins *</label>
              <input
                type="number"
                name="walkIns"
                value={formData.walkIns}
                onChange={handleChange}
                placeholder="e.g., 12"
                required
              />
            </div>
            <div className="form-group">
              <label>Leads Followed Up Today *</label>
              <input
                type="number"
                name="leadsFollowedUp"
                value={formData.leadsFollowedUp}
                onChange={handleChange}
                placeholder="e.g., 8"
                required
              />
            </div>
            <div className="form-group">
              <label>Conversions from Leads *</label>
              <input
                type="number"
                name="conversions"
                value={formData.conversions}
                onChange={handleChange}
                placeholder="e.g., 2"
                required
              />
            </div>
          </div>
        </div>

        {/* Targets Section */}
        <div className="form-section">
          <h2>🎯 Targets</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Daily Target (₹)</label>
              <input
                type="text"
                value={`₹ ${parseFloat(assignmentData.dailyTarget).toLocaleString('en-IN')}`}
                disabled
                className="locked-input target-display"
              />
              <small className="help-text">Set by Manager</small>
            </div>
            <div className="form-group">
              <label>Achievement (₹) *</label>
              <input
                type="number"
                name="achievement"
                value={formData.achievement}
                onChange={handleChange}
                placeholder="e.g., 280000"
                required
              />
              <small className="help-text">Your total achievement today</small>
            </div>
            <div className="form-group">
              <label>Achievement %</label>
              <input
                type="text"
                value={`${achievementPercent}%`}
                disabled
                className="locked-input achievement-display"
              />
              <small className="help-text">Auto-calculated</small>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? '📤 Submitting...' : '✅ Submit Daily Business Form'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeDailyBusinessForm;
