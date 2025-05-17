import React, { useState } from "react";
import axios from "axios";
import "../CSS/LoginPage.css";
import "../CSS/loginResponsiveness.css";

function LoginPage() {
  const [userData, setUserData] = useState({
    userId: "",
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/user-portal/register",
        userData
      );
      alert("Registration successful!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Error registering user.");
    }
  };

  return (
    <div className="login-container">
      <h2>Customer Complaint Portal</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userId"
          placeholder="Enter your ID"
          value={userData.userId}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Enter your Name"
          value={userData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your Email"
          value={userData.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Proceed</button>
      </form>
    </div>
  );
}

export default LoginPage;
