import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/viewComplain.css";
import useUser from "../hooks/useUser";

const ViewComplain = () => {
  const [complaints, setComplaints] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  const { state, dispatch } = useUser();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!userId) {
        dispatch({
          type: "setMessage",
          payload: {
            type: "error",
            text: "User not logged in. Please log in again.",
          },
        });
        return;
      }

      dispatch({ type: "isLoading", payload: true });
      try {
        const res = await axios.get(
          `http://localhost:3000/user-portal/complain?userId=${userId}`
        );
        setComplaints(res.data);

        dispatch({
          type: "setMessage",
          payload: {
            type: "success",
            text: "Complaints fetched successfully!",
          },
        });
      } catch (error) {
        console.error("Error fetching complaints:", error);

        const errMsg =
          error.response?.data?.message ||
          "Error fetching complaints. Please try again.";
        dispatch({
          type: "setMessage",
          payload: { type: "error", text: errMsg },
        });
      } finally {
        dispatch({ type: "isLoading", payload: false });
        setTimeout(() => {
          dispatch({ type: "clearMessage" });
        }, 2000);
      }
    };

    fetchComplaints();
  }, [userId, dispatch]);

  const getComplaintId = (complaint) => complaint.complaintId;

  const handleDelete = async (complaint) => {
    const complaintId = getComplaintId(complaint);
    if (!complaintId) {
      dispatch({
        type: "setMessage",
        payload: { type: "error", text: "Error: Complaint ID not found." },
      });
      return;
    }

    if (!window.confirm("Are you sure you want to delete this complaint?"))
      return;

    dispatch({ type: "isLoading", payload: true });
    try {
      await axios.delete(
        `http://localhost:3000/user-portal/complain/${complaintId}?userId=${userId}`
      );

      setComplaints(
        complaints.filter((c) => getComplaintId(c) !== complaintId)
      );
      dispatch({
        type: "setMessage",
        payload: { type: "success", text: "Complaint deleted successfully!" },
      });
    } catch (error) {
      console.error("Error deleting complaint:", error);

      const errMsg =
        error.response?.data?.message ||
        "Failed to delete complaint. Please try again.";
      dispatch({
        type: "setMessage",
        payload: { type: "error", text: errMsg },
      });
    } finally {
      dispatch({ type: "isLoading", payload: false });
      setTimeout(() => {
        dispatch({ type: "clearMessage" });
      }, 2000);
    }
  };

  const handleEdit = (complaint) => {
    setEditingId(getComplaintId(complaint));
    setEditDescription(complaint.description);
  };

  const handleSaveEdit = async (complaint) => {
    const complaintId = getComplaintId(complaint);

    if (!complaintId) {
      dispatch({
        type: "setMessage",
        payload: { type: "error", text: "Error: Complaint ID not found." },
      });
      return;
    }

    if (!editDescription.trim()) {
      dispatch({
        type: "setMessage",
        payload: { type: "error", text: "Please enter a valid description." },
      });
      return;
    }

    if (editDescription.length > 250) {
      dispatch({
        type: "setMessage",
        payload: {
          type: "error",
          text: "Description must be 250 characters or less.",
        },
      });
      return;
    }

    dispatch({ type: "isLoading", payload: true });
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
      dispatch({
        type: "setMessage",
        payload: { type: "success", text: "Complaint updated successfully!" },
      });
    } catch (error) {
      console.error("Error updating complaint:", error);

      const errMsg =
        error.response?.data?.message ||
        "Failed to update complaint. Please try again.";
      dispatch({
        type: "setMessage",
        payload: { type: "error", text: errMsg },
      });
    } finally {
      dispatch({ type: "isLoading", payload: false });
      setTimeout(() => {
        dispatch({ type: "clearMessage" });
      }, 2000);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDescription("");
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
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

      <div className="userFlow">
        {state.successMessage && (
          <div className="success-message">{state.message?.text}</div>
        )}
        {state.errorMessage && (
          <div className="error-message">{state.message?.text}</div>
        )}
      </div>

      {state.isLoading && complaints.length === 0 ? (
        <div className="loading-message">Loading complaints...</div>
      ) : complaints.length === 0 && !state.errorMessage ? (
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
                      disabled={state.isLoading}
                    />
                    <div className="char-count">
                      {editDescription.length}/250 characters
                    </div>
                    <div className="edit-actions">
                      <button
                        onClick={() => handleSaveEdit(complaint)}
                        className="save-btn"
                        disabled={state.isLoading || !editDescription.trim()}
                      >
                        {state.isLoading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="cancel-btn"
                        disabled={state.isLoading}
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
                        disabled={state.isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(complaint)}
                        className="delete-btn"
                        disabled={state.isLoading}
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
