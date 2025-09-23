import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/AdminForm.css";

const StaffLogin = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useUser();

  const handleChange = (e) => {
    dispatch({
      type: "adminSignIn",
      payload: { id: e.target.id, value: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { adminId, name } = state.adminSignIn;

    dispatch({ type: "isLoading", payload: true });

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/login",
        {
          adminId,
          name,
        },
        { withCredentials: true }
      );

      const data = response.data;
      console.log("Response data:", data);

      if (response.status === 200 && data.success) {
        localStorage.setItem("adminId", data.admin.adminId);
        localStorage.setItem("adminName", data.admin.name);
        localStorage.setItem("adminEmail", data.admin.email);

        dispatch({ type: "SuccessMessage", payload: true });
        dispatch({ type: "ErrorMessage", payload: false });
        dispatch({ type: "isLoading", payload: false });

        console.log("Login successful, navigating...");
        navigate("/admin-dashboard");
      } else {
        dispatch({ type: "SuccessMessage", payload: false });
        dispatch({ type: "ErrorMessage", payload: true });
        dispatch({ type: "isLoading", payload: false });
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);

      dispatch({ type: "SuccessMessage", payload: false });
      dispatch({ type: "ErrorMessage", payload: true });
      dispatch({ type: "isLoading", payload: false });

      if (error.response) {
        const errorMessage = error.response.data?.message || "Server error";
        alert(errorMessage);
        console.log("Server error:", error.response.status, errorMessage);
      } else if (error.request) {
        alert("No response from server. Please check your connection.");
        console.log("Network error:", error.request);
      } else {
        alert("An unexpected error occurred.");
        console.log("Unexpected error:", error.message);
      }
    }

    setTimeout(() => {
      dispatch({ type: "clearMessage" });
    }, 2000);
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <h2>Admin Portal</h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="adminId">Admin ID</label>
          <input
            type="text"
            id="adminId"
            name="adminId"
            value={state.adminSignIn.adminId}
            onChange={handleChange}
            required
            placeholder="Enter your admin ID"
            disabled={state.isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={state.adminSignIn.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            disabled={state.isLoading}
          />
        </div>

        <button
          type="submit"
          className="proceed-btn"
          disabled={state.isLoading}
        >
          {state.isLoading ? "Processing..." : "Proceed to Dashboard"}
        </button>
      </form>

      <div className="adminFlow-status">
        {state.successMessage && (
          <p style={{ color: "green" }}>Signed In Successfully!</p>
        )}
        {state.errorMessage && <p style={{ color: "red" }}>Error Signing In</p>}
      </div>
    </div>
  );
};

export default StaffLogin;
