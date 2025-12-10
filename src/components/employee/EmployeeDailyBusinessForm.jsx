import React, { useState, useEffect } from 'react';

// ⚠️ STEP 1: Replace this with your actual Google Apps Script Web App URL 
const METRICS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzdlsmYtd-g2LBLhUSjWFblVrcD6Y8JBM4DWu0Lm05wQLqIy39QEcRij7TIX1Zg08b1/exec'; // PASTE THE /exec URL

// Helper function for sending data to the Apps Script endpoint
const sendToAppsScript = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            // Use 'no-cors' for POST to Apps Script to ensure it works universally
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'text/plain', 
            },
            body: JSON.stringify(data), 
        });

        // Due to 'no-cors', we assume success if the fetch operation finished without a network error.
        console.log('Apps Script metrics request sent. Assuming successful delivery.');
        
        return { success: true, error: null }; 

    } catch (error) {
        console.error('Apps Script Submission Network Error:', error);
        return { success: false, error: 'Failed to connect to backend service (Network error). Please check the URL and connectivity.' };
    }
};


const EmployeeDailyBusinessForm = ({ employeeData = { name: 'Priya Sharma', id: 'EMP101' } }) => {
    // Mock assignment data (in a real app, this comes from a database/API)
    const [assignmentData] = useState({
        date: new Date().toISOString().split('T')[0],
        dailyTarget: '300000', 
        managerName: 'Rajesh Kumar',
        branch: 'Mumbai Central'
    });

    const [formData, setFormData] = useState({
        newLoans: '',
        totalDisbursement: '', // Corresponds to 'Total Value (₹)' in the sheet
        renewals: '',
        walkIns: '',
        leadsFollowedUp: '',
        conversions: '',
        achievement: '' // Total Disbursement/Achievement for percentage calculation
    });

    const [achievementPercent, setAchievementPercent] = useState('0.00');
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    // Auto-calculate Achievement %
    useEffect(() => {
        const target = parseFloat(assignmentData.dailyTarget) || 0;
        // Using 'totalDisbursement' (Total Value) as the main Achievement metric
        const achieved = parseFloat(formData.totalDisbursement) || 0; 
        
        if (target > 0) {
            const percent = ((achieved / target) * 100).toFixed(2);
            setAchievementPercent(percent);
            // Also set 'achievement' for consistency, though 'totalDisbursement' is the key metric
            setFormData(prev => ({ ...prev, achievement: achieved.toString() }));
        } else {
            setAchievementPercent('0.00');
            setFormData(prev => ({ ...prev, achievement: '' }));
        }
    }, [formData.totalDisbursement, assignmentData.dailyTarget]); // DEPENDS on totalDisbursement

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Allow empty string for clearing
        const validatedValue = value === '' ? '' : Math.max(0, parseFloat(value)).toString();
        
        setFormData(prev => ({
            ...prev,
            [name]: validatedValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitStatus(null);

        // STEP 2: Structure data to match the Apps Script's expected keys
        const dataToSend = {
            managerName: assignmentData.managerName,
            branch: assignmentData.branch,
            date: assignmentData.date,
            dailyTarget: assignmentData.dailyTarget,
            
            // Employee Details
            employeeName: employeeData.name,
            
            // Business Metrics
            newLoans: formData.newLoans,
            totalDisbursement: formData.totalDisbursement,
            renewals: formData.renewals,
            walkins: formData.walkIns,
            leadsFollowed: formData.leadsFollowedUp, 
            conversions: formData.conversions,
            
            // Targets and Achievement (calculated value is the key)
            achievement: formData.totalDisbursement, // Sending the value for 'Total Value'
            achievementPercent: achievementPercent
        };

        // STEP 3: Send data to the Apps Script endpoint
        const result = await sendToAppsScript(METRICS_WEB_APP_URL, dataToSend);

        setLoading(false);

        if (result.success) {
            setSubmitStatus({ 
                type: 'success', 
                message: '✅ Daily Business Form submitted successfully! Your metrics have been recorded.' 
            });
            
            // Clear form after a short delay
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
                message: `❌ Submission Error: ${result.error || 'Failed to connect to the backend service.'}` 
            });
        }
    };

    // The JSX structure remains mostly the same as your original code
    return (
        <div className="employee-form-container">
            <div className="form-header">
                <h1>📊 Daily Business Update Form</h1>
                <p>Fill in your daily business metrics</p>
            </div>

            {submitStatus && (
                <div className={`alert alert-${submitStatus.type === 'error' ? 'error' : 'success'}`}>
                    {submitStatus.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="form">
                {/* Assignment Info - Read Only */}
                <div className="form-section locked-section">
                    <h2>📋 Assignment Details</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Employee Name</label>
                            <input type="text" value={employeeData.name} disabled className="locked-input"/>
                        </div>
                        <div className="form-group">
                            <label>Branch</label>
                            <input type="text" value={assignmentData.branch} disabled className="locked-input"/>
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input type="text" value={assignmentData.date} disabled className="locked-input"/>
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
                                type="number" name="newLoans" value={formData.newLoans}
                                onChange={handleChange} placeholder="e.g., 5" required
                            />
                        </div>
                        <div className="form-group">
                            <label>Total Disbursement Value (₹) *</label>
                            <input
                                type="number" name="totalDisbursement" value={formData.totalDisbursement}
                                onChange={handleChange} placeholder="e.g., 250000" required
                            />
                        </div>
                        <div className="form-group">
                            <label>Renewals Completed *</label>
                            <input
                                type="number" name="renewals" value={formData.renewals}
                                onChange={handleChange} placeholder="e.g., 3" required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Customer Walk-ins *</label>
                            <input
                                type="number" name="walkIns" value={formData.walkIns}
                                onChange={handleChange} placeholder="e.g., 12" required
                            />
                        </div>
                        <div className="form-group">
                            <label>Leads Followed Up Today *</label>
                            <input
                                type="number" name="leadsFollowedUp" value={formData.leadsFollowedUp}
                                onChange={handleChange} placeholder="e.g., 8" required
                            />
                        </div>
                        <div className="form-group">
                            <label>Conversions from Leads *</label>
                            <input
                                type="number" name="conversions" value={formData.conversions}
                                onChange={handleChange} placeholder="e.g., 2" required
                            />
                        </div>
                    </div>
                </div>

                {/* Targets Section */}
                <div className="form-section">
                    <h2>🎯 Targets & Performance</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Daily Target (₹)</label>
                            <input
                                type="text"
                                value={`₹ ${parseFloat(assignmentData.dailyTarget).toLocaleString('en-IN')}`}
                                disabled className="locked-input target-display"
                            />
                            <small className="help-text">Set by Manager</small>
                        </div>
                        <div className="form-group">
                            <label>Achievement (₹)</label>
                            {/* This is a display-only field now, reflecting Total Disbursement */}
                            <input
                                type="text"
                                value={formData.totalDisbursement ? `₹ ${parseFloat(formData.totalDisbursement).toLocaleString('en-IN')}` : '0'}
                                disabled className="locked-input target-display"
                            />
                            <small className="help-text">Total Disbursement Value</small>
                        </div>
                        <div className="form-group">
                            <label>Achievement %</label>
                            <input
                                type="text"
                                value={`${achievementPercent}%`}
                                disabled className="locked-input achievement-display"
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