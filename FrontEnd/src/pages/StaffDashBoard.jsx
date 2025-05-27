import { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/StaffDashboard.css";

function StaffDashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/user-portal/complain/all")
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error("Error fetching complaints:", err));
  }, []);

  const markAsReviewed = async (complaintId) => {
    try {
      // Get adminId from localStorage
      const adminId = localStorage.getItem("adminId");
      await axios.put(
        `http://localhost:3000/user-portal/complain/review/${complaintId}`,
        {
          adminId: parseInt(adminId),
        }
      );

      // Update the local state
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaintId === complaintId ? { ...c, isReviewed: 1 } : c
        )
      );

      console.log(
        `Complaint ${complaintId} marked as reviewed by admin ${adminId}`
      );
    } catch (err) {
      console.error("Error updating complaint:", err);

      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("Failed to mark complaint as reviewed. Please try again.");
      }
    }
  };

  return (
    <div className="staff-dashboard">
      <div className="staff-header">
        <h2>Staff Dashboard</h2>
      </div>

      <div className="staff-complaints-list">
        {complaints.map((c) => (
          <div className="staff-card" key={c.complaintId}>
            <p className="staff-user-id">
              <strong>User ID:</strong> {c.userId}
            </p>
            <p className="staff-description">{c.description}</p>
            <p className="staff-status">
              <strong>Status:</strong>{" "}
              {c.isReviewed ? (
                <span className="yes">✅ Reviewed</span>
              ) : (
                <span className="no">❌ Pending</span>
              )}
            </p>
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
        ))}
      </div>
    </div>
  );
}

export default StaffDashboard;
