import { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/StaffDashboard.css";
import useUser from "../hooks/useUser";

function StaffDashboard() {
  const { state, dispatch } = useUser();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      dispatch({ type: "isLoading", payload: true });
      const response = await axios.get(
        "http://localhost:3000/admin/complaints"
      );
      setComplaints(response.data);
    } catch (err) {
      dispatch({
        type: "setMessage",
        payload: { type: "error", text: "Error fetching complaints" },
      });
      console.error("Error fetching complaints:", err);
    } finally {
      dispatch({ type: "isLoading", payload: false });
    }
  };

  const markAsReviewed = async (complaintId) => {
    try {
      const adminId = localStorage.getItem("adminId");
      if (!adminId) {
        dispatch({
          type: "setMessage",
          payload: {
            type: "error",
            text: "Admin ID not found. Please login again.",
          },
        });
        return;
      }

      await axios.put(
        `http://localhost:3000/admin/complaints/${complaintId}/review`,
        { adminId: parseInt(adminId) }
      );

      setComplaints((prev) =>
        prev.map((c) =>
          c.complaintId === complaintId ? { ...c, isReviewed: true } : c
        )
      );

      dispatch({
        type: "setMessage",
        payload: {
          type: "success",
          text: `Complaint ${complaintId} marked as reviewed successfully!`,
        },
      });
    } catch (err) {
      console.error("Error updating complaint:", err);

      if (err.response?.data?.message) {
        dispatch({
          type: "setMessage",
          payload: { type: "error", text: err.response.data.message },
        });
      } else {
        dispatch({
          type: "setMessage",
          payload: {
            type: "error",
            text: "Failed to mark complaint as reviewed. Please try again.",
          },
        });
      }
    }
  };

  if (state.isLoading) {
    return (
      <div className="staff-dashboard">
        <div className="staff-header">
          <h2>Staff Dashboard</h2>
        </div>
        <div className="loading">Loading complaints...</div>
      </div>
    );
  }

  if (state.message.type === "error" && complaints.length === 0) {
    return (
      <div className="staff-dashboard">
        <div className="staff-header">
          <h2>Staff Dashboard</h2>
        </div>
        <div className="error">
          <p>{state.message.text}</p>
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

      {state.message.text && (
        <div className={`userFlow-status ${state.message.type}`}>
          <p>{state.message.text}</p>
        </div>
      )}

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
