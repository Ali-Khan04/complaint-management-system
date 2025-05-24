import React, { useState } from "react";
import axios from "axios";
import "../CSS/Complaint.css";
import { Link } from "react-router-dom";

function UserComplain() {
  const [description, setDescription] = useState("");

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    try {
      await axios.post("http://localhost:3000/user-portal/complain", {
        userId,
        description,
      });
      alert("Complaint submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error submitting complaint.");
    }
  };

  return (
    <div className="user-complain-container">
      <h2>Submit Your Complaint</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="description"
          value={description}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Write your complaint here..."
        />
        <button type="submit">Submit Complaint</button>
      </form>
      <Link to="/viewComplains">Your Complains</Link>
    </div>
  );
}

export default UserComplain;
