import React, { useState } from "react";
import axios from "axios";
import "../CSS/Complaint.css";
import { Link } from "react-router-dom";
import useUser from "../hooks/useUser";

function UserComplain() {
  const [description, setDescription] = useState("");
  const { state, dispatch } = useUser();

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      dispatch({
        type: "setMessage",
        payload: {
          type: "error",
          text: "Please enter a complaint description.",
        },
      });
      return;
    }

    const userId = localStorage.getItem("userId");
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
      const response = await axios.post(
        "http://localhost:3000/user-portal/complain",
        {
          userId,
          description: description.trim(),
        }
      );

      dispatch({
        type: "setMessage",
        payload: {
          type: "success",
          text: `Complaint submitted successfully! ID: ${response.data.complaintId}`,
        },
      });
      setDescription("");
    } catch (error) {
      console.error("Error submitting complaint:", error);

      let errMsg = "Error submitting complaint. Please try again.";
      if (error.response?.status === 404) {
        errMsg = "User not found. Please log in again.";
      } else if (error.response?.data?.message) {
        errMsg = error.response.data.message;
      }

      dispatch({
        type: "setMessage",
        payload: { type: "error", text: errMsg },
      });
    } finally {
      dispatch({ type: "isLoading", payload: false });
    }

    setTimeout(() => {
      dispatch({ type: "clearMessage" });
    }, 2000);
  };

  return (
    <div className="user-complain-container">
      <h2>Submit Your Complaint</h2>

      <div className="userFlow">
        {state.successMessage && (
          <div className="success-message">{state.message?.text}</div>
        )}
        {state.errorMessage && (
          <div className="error-message">{state.message?.text}</div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          name="description"
          value={description}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Write your complaint here..."
          disabled={state.isLoading}
          maxLength={250}
        />
        <div className="char-count">{description.length}/250 characters</div>

        <button type="submit" disabled={state.isLoading || !description.trim()}>
          {state.isLoading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>

      <Link to="/viewComplains">View Your Complaints</Link>
    </div>
  );
}

export default UserComplain;
