import { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/StaffDashboard.css";

function StaffDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/admin/complaints"
      );
      setComplaints(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to fetch complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markAsReviewed = async (complaintId) => {
    try {
      // Get adminId from localStorage
      const adminId = localStorage.getItem("adminId");

      if (!adminId) {
        alert("Admin ID not found. Please login again.");
        return;
      }
      const response = await axios.put(
        `http://localhost:3000/admin/complaints/${complaintId}/review`,
        {
          adminId: parseInt(adminId),
        }
      );

      // Update the local state
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaintId === complaintId ? { ...c, isReviewed: true } : c
        )
      );

      alert(`Complaint ${complaintId} marked as reviewed successfully!`);
      console.log("Review response:", response.data);
    } catch (err) {
      console.error("Error updating complaint:", err);

      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("Failed to mark complaint as reviewed. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="staff-dashboard">
        <div className="staff-header">
          <h2>Staff Dashboard</h2>
        </div>
        <div className="loading">Loading complaints...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-dashboard">
        <div className="staff-header">
          <h2>Staff Dashboard</h2>
        </div>
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchComplaints} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-dashboard">
      <div className="staff-header">
        <h2>Staff Dashboard</h2>
        <div className="dashboard-stats">
          <span className="stat">Total: {complaints.length}</span>
          <span className="stat">
            Pending: {complaints.filter((c) => !c.isReviewed).length}
          </span>
          <span className="stat">
            Reviewed: {complaints.filter((c) => c.isReviewed).length}
          </span>
        </div>
      </div>

      <div className="staff-complaints-list">
        {complaints.length === 0 ? (
          <div className="no-complaints">
            <p>No complaints found.</p>
          </div>
        ) : (
          complaints.map((c) => (
            <div className="staff-card" key={c.complaintId}>
              <div className="complaint-header">
                <p className="staff-user-id">
                  <strong>User ID:</strong> {c.userId}
                </p>
                <p className="complaint-id">
                  <strong>ID:</strong> {c.complaintId}
                </p>
              </div>

              {/* Display user info if available from associations */}
              {c.User && (
                <div className="user-info">
                  <p>
                    <strong>User:</strong> {c.User.name} ({c.User.email})
                  </p>
                </div>
              )}

              <p className="staff-description">
                <strong>Description:</strong> {c.description}
              </p>

              <div className="complaint-meta">
                <p className="complaint-time">
                  <strong>Submitted:</strong>{" "}
                  {new Date(c.Time).toLocaleString()}
                </p>
                <p className="staff-status">
                  <strong>Status:</strong>{" "}
                  {c.isReviewed ? (
                    <span className="status-reviewed">✅ Reviewed</span>
                  ) : (
                    <span className="status-pending">❌ Pending</span>
                  )}
                </p>
              </div>

              {!c.isReviewed && (
                <div className="staff-actions">
                  <button
                    className="review-btn"
                    onClick={() => markAsReviewed(c.complaintId)}
                  >
                    Mark as Reviewed
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StaffDashboard;
