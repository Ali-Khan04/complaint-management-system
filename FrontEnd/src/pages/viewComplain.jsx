import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/viewComplain.css";

const ViewComplain = () => {
  const [complaints, setComplaints] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!userId) {
        setError("User not logged in. Please log in again.");
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/user-portal/complain?userId=${userId}`
        );
        setComplaints(res.data);
        setError("");
      } catch (error) {
        console.error("Error fetching complaints:", error);
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError("Error fetching complaints. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [userId]);

  const getComplaintId = (complaint) => {
    return complaint.complaintId;
  };

  const handleDelete = async (complaint) => {
    const complaintId = getComplaintId(complaint);

    if (!complaintId) {
      alert("Error: Complaint ID not found");
      return;
    }

    if (window.confirm("Are you sure you want to delete this complaint?")) {
      setLoading(true);
      try {
        await axios.delete(
          `http://localhost:3000/user-portal/complain/${complaintId}?userId=${userId}`
        );

        setComplaints(
          complaints.filter((c) => getComplaintId(c) !== complaintId)
        );
        alert("Complaint deleted successfully!");
      } catch (error) {
        console.error("Error deleting complaint:", error);

        if (error.response?.status === 404) {
          alert(
            "Complaint not found or you don't have permission to delete it."
          );
        } else if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert("Failed to delete complaint. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (complaint) => {
    const complaintId = getComplaintId(complaint);
    setEditingId(complaintId);
    setEditDescription(complaint.description);
  };

  const handleSaveEdit = async (complaint) => {
    const complaintId = getComplaintId(complaint);

    if (!complaintId) {
      alert("Error: Complaint ID not found");
      return;
    }

    if (!editDescription.trim()) {
      alert("Please enter a valid description.");
      return;
    }

    if (editDescription.length > 250) {
      alert("Description must be 250 characters or less.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/user-portal/complain/${complaintId}?userId=${userId}`,
        { description: editDescription.trim() }
      );

      setComplaints(
        complaints.map((c) =>
          getComplaintId(c) === complaintId
            ? { ...c, description: editDescription.trim() }
            : c
        )
      );

      setEditingId(null);
      setEditDescription("");
      alert("Complaint updated successfully!");
    } catch (error) {
      console.error("Error updating complaint:", error);

      if (error.response?.status === 404) {
        alert("Complaint not found or you don't have permission to update it.");
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to update complaint. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDescription("");
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return "Invalid date";
    }
  };

  if (!userId) {
    return (
      <div className="complaints-container">
        <div className="error-message">
          Please log in to view your complaints.
        </div>
      </div>
    );
  }

  return (
    <div className="complaints-container">
      <div className="complaints-header">
        <h2>Your Complaints</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && complaints.length === 0 ? (
        <div className="loading-message">Loading complaints...</div>
      ) : complaints.length === 0 && !error ? (
        <div className="no-complaints">
          <p>No complaints submitted yet.</p>
        </div>
      ) : (
        <div className="complaints-list">
          {complaints.map((complaint) => {
            const complaintId = getComplaintId(complaint);
            return (
              <div key={complaintId} className="complaint-card">
                {editingId === complaintId ? (
                  <div className="edit-form">
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="edit-textarea"
                      rows="4"
                      placeholder="Edit your complaint..."
                      maxLength={250}
                      disabled={loading}
                    />
                    <div className="char-count">
                      {editDescription.length}/250 characters
                    </div>
                    <div className="edit-actions">
                      <button
                        onClick={() => handleSaveEdit(complaint)}
                        className="save-btn"
                        disabled={loading || !editDescription.trim()}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="cancel-btn"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="complaint-content">
                      <div className="complaint-id">
                        Complaint ID: {complaintId}
                      </div>
                      <p className="complaint-description">
                        {complaint.description}
                      </p>
                      <p className="complaint-date">
                        Submitted: {formatDate(complaint.time)}
                      </p>
                      <p className="complaint-reviewed">
                        Review Status:{" "}
                        <span
                          className={
                            complaint.isReviewed === true
                              ? "reviewed-yes"
                              : complaint.isReviewed === false
                              ? "reviewed-no"
                              : "reviewed-pending"
                          }
                        >
                          {complaint.isReviewed === true
                            ? "Reviewed"
                            : complaint.isReviewed === false
                            ? "Not Reviewed"
                            : "Pending"}
                        </span>
                      </p>
                      {complaint.User && (
                        <div className="complaint-user-info">
                          <small>Submitted by: {complaint.User.name}</small>
                        </div>
                      )}
                    </div>

                    <div className="complaint-actions">
                      <button
                        onClick={() => handleEdit(complaint)}
                        className="edit-btn"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(complaint)}
                        className="delete-btn"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewComplain;
