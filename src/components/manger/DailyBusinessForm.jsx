import React, { useState } from 'react';
// import { sendToN8N, N8N_WEBHOOKS } from '../../config/n8nConfig'; // Keeping original structure
import { teamsData, getAllEmployees } from '../../config/teamsData';

// ⚠️ IMPORTANT: Replace this with your actual, deployed Apps Script Web App URL ending in /exec
const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyCGl3ZraOzzv2dH3tiSA4WwVVkLEtw3z5Gn-y1VSufC2M4x_-Cw85Lc9kFCI1JlKFN/exec'; 

// Helper function for sending data to the Apps Script endpoint
const sendToAppsScript = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'text/plain', 
            },
            body: JSON.stringify(data), 
        });
        console.log('Apps Script request sent. Response is opaque due to no-cors mode, assuming successful delivery.');
        return { success: true, error: null }; 

    } catch (error) {
        console.error('Apps Script Submission Network Error:', error);
        return { success: false, error: 'Network Error. Could not reach the Apps Script endpoint.' };
    }
};


const DailyBusinessForm = ({ managerData = { name: 'Rajesh Kumar', branch: 'Mumbai Central' } }) => {
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
    
    const updateSelectAllState = (newSelectedEmployeeIds) => {
        setSelectAll(newSelectedEmployeeIds.length === allEmployees.length);
    };

    const handleTeamSelect = (teamId, isChecked) => {
        const team = teamsData.find(t => t.teamId === teamId);
        if (!team) return;

        const teamEmployeeIds = team.employees.map(emp => emp.id);

        setFormData(prev => {
            let newSelected = [...prev.selectedEmployees];

            if (isChecked) {
                const combinedIds = new Set([...newSelected, ...teamEmployeeIds]);
                newSelected = Array.from(combinedIds);
            } else {
                newSelected = newSelected.filter(id => !teamEmployeeIds.includes(id));
            }
            
            updateSelectAllState(newSelected);

            return {
                ...prev,
                selectedEmployees: newSelected
            };
        });
    };

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        
        setFormData(prev => ({
            ...prev,
            selectedEmployees: checked ? allEmployees.map(emp => emp.id) : []
        }));
    };

    const handleEmployeeSelect = (employeeId) => {
        setFormData(prev => {
            const isSelected = prev.selectedEmployees.includes(employeeId);
            const newSelected = isSelected
                ? prev.selectedEmployees.filter(id => id !== employeeId)
                : [...prev.selectedEmployees, employeeId];
            
            updateSelectAllState(newSelected); 
            
            return {
                ...prev,
                selectedEmployees: newSelected
            };
        });
    };
    
    const isTeamFullySelected = (team) => {
        return team.employees.every(employee => formData.selectedEmployees.includes(employee.id));
    };


    const handleSubmit = async (e) => {
        
        e.preventDefault();
        
        if (formData.selectedEmployees.length === 0) {
            setSubmitStatus({ type: 'error', message: 'Please select at least one employee' });
            return;
        }
        
        if (!formData.dailyTarget || isNaN(Number(formData.dailyTarget))) {
            setSubmitStatus({ type: 'error', message: 'Please enter a valid daily target amount.' });
            return;
        }

        setLoading(true);
        setSubmitStatus(null);

        const selectedEmployeesData = allEmployees.filter(emp => 
            formData.selectedEmployees.includes(emp.id)
        );

        const employeeNames = selectedEmployeesData.map(emp => emp.name);

        const dataToSend = {
            managerName: managerData.name,
            branch: managerData.branch,
            date: formData.date,
            dailyTarget: formData.dailyTarget,
            selectedEmployees: employeeNames, 
        };

        const result = await sendToAppsScript(APPS_SCRIPT_WEB_APP_URL, dataToSend);
        
        setLoading(false);

        if (result.success) {
            setSubmitStatus({ 
                type: 'success', 
                message: `✅ Assignment successful (Backend trigger sent). Emails will be sent shortly to ${selectedEmployeesData.length} employees.` 
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
                message: `❌ Error: ${result.error || 'Check the console for network issues.'}` 
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
                <div className={`alert alert-${submitStatus.type === 'error' ? 'error' : 'success'}`}>
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

                <hr/>

                {/* Employee Selection - Teams (MODIFIED) */}
                <div className="form-section">
                    <div className="section-header">
                        <h2>👥 Select Employees (Team-wise)</h2>
                        {/* Overall Select All Checkbox */}
                        <label className="select-all-label">
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                // NOTE: Consider applying transform: scale() here too if needed
                            />
                            <span>Select All Employees</span>
                        </label>
                    </div>

                    <div className="teams-grid">
                        {teamsData.map(team => (
                            <div key={team.teamId} className="team-card">
                                
                                {/* Team-level Checkbox with increased size */}
                                <div className="team-header">
                                    <label className="team-select-label" style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={isTeamFullySelected(team)}
                                            ref={el => {
                                                if (el) {
                                                    const isPartial = formData.selectedEmployees.some(id => 
                                                        team.employees.map(emp => emp.id).includes(id)
                                                    ) && !isTeamFullySelected(team);
                                                    el.indeterminate = isPartial;
                                                }
                                            }}
                                            onChange={(e) => handleTeamSelect(team.teamId, e.target.checked)}
                                            // 🌟 INLINE STYLE TO INCREASE CHECKBOX SIZE 🌟
                                            style={{ marginRight: '10px', transform: 'scale(1.5)' }} 
                                        />
                                        <h3 style={{ margin: 0, fontWeight: 'bold' }}>{team.teamName} ({team.employees.length})</h3>
                                    </label>
                                </div>
                                
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

                <hr/>

                {/* Business Metrics & Targets - Unchanged */}
                <div className="form-section">
                    <h2>📊 Business Metrics & Targets</h2>
                    <p className="section-note">
                        <em>Note: Business Metrics will be filled by employees. Manager sets the Daily Target below.</em>
                    </p>

                    <div className="metrics-container">
                        {/* Business Metrics (Read-only placeholders) */}
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