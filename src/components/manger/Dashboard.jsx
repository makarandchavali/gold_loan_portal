import React, { useEffect, useState } from "react";

const APPS_SCRIPT_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwf8TUBiPA7r7f6eQFbeqA-AMc2KcnbuPDrCOAvfwWpM67Cn6ajREKQXIqBUT5HL4TS/exec";

const Dashboard = ({
  managerData = {
    name: "Rajesh Kumar",
    id: "MGR005",
    branch: "Mumbai Central",
    email: "rajesh.k@bank.com",
  },
}) => {
  /* ---------------- STATE ---------------- */
  const [stats, setStats] = useState({
    totalAssignments: 0,
    pendingForms: 0,
    completedToday: 0,
    totalEmployees: 0,
  });

  const [recentAssignments, setRecentAssignments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- FETCH DATA ---------------- */
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${APPS_SCRIPT_WEB_APP_URL}?action=dashboard`
      );
      const data = await res.json();
      
      if (data.error) {
          throw new Error(data.error);
      }
      
      setStats(data.stats);
      setRecentAssignments(data.recentAssignments);
    } catch (err) {
      setError("Failed to load dashboard data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* ---------------- ACTION HANDLERS ---------------- */
  const handleSendReminder = async (assignmentId) => {
    try {
        // Optimistic UI update disabled for simplicity, will rely on success message
        const res = await fetch(
          `${APPS_SCRIPT_WEB_APP_URL}?action=sendReminder&assignmentId=${assignmentId}`
        );
        const data = await res.json();
        
        if (data.error) {
            alert(`❌ Failed to send reminder: ${data.error}`);
        } else {
            alert(`✅ Reminder email sent: ${data.message}`);
        }
    } catch (err) {
        alert("❌ Network error: Could not connect to send reminder.");
    }
    // No need to refetch dashboard data as status doesn't change
  };

  const handleViewSubmission = (link) => {
    window.open(link, "_blank");
  };

  /* ---------------- HELPERS ---------------- */
  const getStatusBadge = (status) => (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: "5px",
        color: "#fff",
        fontWeight: "bold",
        backgroundColor: status === "Submitted" ? "#2ecc71" : "#f39c12",
      }}
    >
      {status}
    </span>
  );

  const filteredAssignments =
    filterStatus === "All"
      ? recentAssignments
      : recentAssignments.filter((a) => a.status === filterStatus);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="dashboard-container">
      <h1>Welcome back, {managerData.name}</h1>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* --------- STATS --------- */}
      <div className="stats-grid">
        {[
          ["📋", stats.totalAssignments, "Total Assignments"],
          ["⏳", stats.pendingForms, "Pending Forms"],
          ["✅", stats.completedToday, "Completed Today"],
          ["👥", stats.totalEmployees, "Total Employees"],
        ].map(([icon, value, label]) => (
          <div key={label} className="stat-card">
            <div className="stat-icon">{icon}</div>
            <h2>{value}</h2>
            <p>{label}</p>
          </div>
        ))}
      </div>

      {/* --------- FILTER --------- */}
      <div style={{ marginTop: 20 }}>
        <label>Status Filter: </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Submitted">Submitted</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* --------- TABLE --------- */}
      <table className="assignments-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>ID</th> {/* Added style for ID width/alignment */}
            <th>Form</th>
            <th>Employee</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th style={{ width: '100px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.length === 0 && (
            <tr>
              <td colSpan="7" align="center">
                No records found
              </td>
            </tr>
          )}

          {filteredAssignments.map((a) => (
            <tr key={a.id}>
              <td style={{ textAlign: 'center' }}>{a.id}</td> {/* Aligned ID content */}
              <td>{a.formType}</td>
              <td>{a.assignedTo}</td>
              <td>{a.date}</td>
              <td>{a.assignedAt}</td>
              <td>{getStatusBadge(a.status)}</td>
              <td>
                {a.status === "Submitted" ? (
                  <button
                    className="btn view"
                    onClick={() => handleViewSubmission(a.submissionLink)}
                  >
                    View
                  </button>
                ) : (
                  <button
                    className="btn remind"
                    onClick={() => handleSendReminder(a.id)}
                  >
                    Remind
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
