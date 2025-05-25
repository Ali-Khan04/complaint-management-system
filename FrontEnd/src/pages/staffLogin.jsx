import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/AdminForm.css";

const StaffLogin = () => {
  const [formData, setFormData] = useState({ adminId: "", name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:3000/user-portal/admin/register", {
        adminId: parseInt(formData.adminId),
        name: formData.name,
      });

      localStorage.setItem("adminId", formData.adminId);
      localStorage.setItem("adminName", formData.name);

      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Error registering admin:", err);
      setError(err.response?.data?.message || "Error registering admin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <h2>Admin Portal</h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="adminId">Admin ID</label>
          <input
            type="text"
            id="adminId"
            name="adminId"
            value={formData.adminId}
            onChange={handleChange}
            required
            placeholder="Enter your admin ID"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="proceed-btn" disabled={isLoading}>
          {isLoading ? "Processing..." : "Proceed to Dashboard"}
        </button>
      </form>
    </div>
  );
};

export default StaffLogin;
