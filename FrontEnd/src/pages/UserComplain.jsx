import React, { useState } from "react";
import axios from "axios";
import "../CSS/Complaint.css";
import { Link } from "react-router-dom";

function UserComplain() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setDescription(e.target.value);
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setError("Please enter a complaint description.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not logged in. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:3000/user-portal/complain",
        {
          userId,
          description: description.trim(),
        }
      );

      setSuccess(
        `Complaint submitted successfully! ID: ${response.data.complaintId}`
      );
      setDescription("");
    } catch (error) {
      console.error("Error submitting complaint:", error);

      if (error.response?.status === 404) {
        setError("User not found. Please log in again.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Error submitting complaint. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-complain-container">
      <h2>Submit Your Complaint</h2>
      <div className="userFlow">
        {" "}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          name="description"
          value={description}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Write your complaint here..."
          disabled={loading}
          maxLength={250}
        />
        <div className="char-count">{description.length}/250 characters</div>

        <button type="submit" disabled={loading || !description.trim()}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>

      <Link to="/viewComplains">View Your Complaints</Link>
    </div>
  );
}

export default UserComplain;
