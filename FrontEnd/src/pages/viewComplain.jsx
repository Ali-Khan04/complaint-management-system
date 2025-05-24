import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/viewComplain.css";

const ViewComplain = () => {
  const [complaints, setComplaints] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/user-portal/complain?userId=${userId}`
        );
        setComplaints(res.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, [userId]);

  // Helper function to get consistent ID
  const getComplaintId = (complaint) => {
    return complaint.id || complaint.complaintId;
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
        alert("Failed to delete complaint. Please try again.");
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

    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:3000/user-portal/complain/${complaintId}?userId=${userId}`,
        { description: editDescription }
      );

      setComplaints(
        complaints.map((c) =>
          getComplaintId(c) === complaintId
            ? { ...c, description: editDescription }
            : c
        )
      );

      setEditingId(null);
      setEditDescription("");
      alert("Complaint updated successfully!");
    } catch (error) {
      console.error("Error updating complaint:", error);
      alert("Failed to update complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDescription("");
  };

  return (
    <div className="complaints-container">
      <div className="complaints-header">
        <h2>Your Complaints</h2>
      </div>

      {complaints.length === 0 ? (
        <div className="no-complaints">
          <p>No complaints submitted yet.</p>
        </div>
      ) : (
        <div className="complaints-list">
          {complaints.map((c) => {
            const complaintId = getComplaintId(c);
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
                    />
                    <div className="edit-actions">
                      <button
                        onClick={() => handleSaveEdit(c)}
                        className="save-btn"
                        disabled={loading}
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
                      <p className="complaint-description">{c.description}</p>
                      <p className="complaint-date">
                        {new Date(c.Time).toLocaleString()}
                      </p>
                      <p className="complaint-reviewed">
                        Reviewed by Admin:{" "}
                        <span className={c.isReviewed ? "yes" : "no"}>
                          {c.isReviewed ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>
                    <div className="complaint-actions">
                      <button
                        onClick={() => handleEdit(c)}
                        className="edit-btn"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="delete-btn"
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : "Delete"}
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
