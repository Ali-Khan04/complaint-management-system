import axios from "axios";
import "../CSS/LoginPage.css";
import "../CSS/loginResponsiveness.css";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
function LoginPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useUser();
  const handleChange = (e) => {
    dispatch({
      type: "SignIn",
      payload: { id: e.target.id, value: e.target.value },
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "isLoading", payload: true });
    const { userId, email, password } = state.SignIn;
    try {
      const response = await axios.post(
        "http://localhost:3000/user-portal/login",
        { userId, email, password },
        { withCredentials: true }
      );
      const data = response.data;

      if (response.ok && data.success) {
        localStorage.setItem("userId", data.user.userId);
        dispatch({ type: "user", payload: data.user });
        dispatch({ type: "SuccessMessage", payload: true });
        dispatch({ type: "ErrorMessage", payload: false });
        dispatch({ type: "isLoading", payload: false });
        navigate("/user-dashboard", { replace: true });
      } else {
        dispatch({ type: "SuccessMessage", payload: false });
        dispatch({ type: "ErrorMessage", payload: true });
        dispatch({ type: "isLoading", payload: false });
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Server error");
      } else {
        alert("Network error. Please try again.");
      }
      dispatch({ type: "SuccessMessage", payload: false });
      dispatch({ type: "ErrorMessage", payload: true });
      dispatch({ type: "isLoading", payload: false });
    }
    setTimeout(() => {
      dispatch({ type: "clearMessage" });
    }, 2000);
  };

  return (
    <div className="login-container">
      <h2>Customer Login Portal</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="userId"
          placeholder="Enter your ID"
          value={state.SignIn?.userId || ""}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          id="email"
          placeholder="Enter your Email"
          value={state.SignIn?.email || ""}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={state.SignIn.password || ""}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="proceed-btn"
          disabled={state.isLoading}
        >
          {state.isLoading ? "Processing..." : "Proceed to Dashboard"}
        </button>
      </form>
      <div className="userFlow-status">
        {state.successMessage && <p>Signed In</p>}
        {state.errorMessage && <p>Error Signing In</p>}
      </div>
      <Link to="/user-signUp" className="minimal-link">
        No Account? Sign Up Now
      </Link>
    </div>
  );
}

export default LoginPage;
