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

      if (response.status === 200 && data.success) {
        localStorage.setItem("userId", data.user.userId);
        dispatch({ type: "user", payload: data.user });
        dispatch({
          type: "setMessage",
          payload: { type: "success", text: "User Signed In!" },
        });
        dispatch({ type: "isLoading", payload: false });
        navigate("/user-dashboard");
      } else {
        dispatch({
          type: "setMessage",
          payload: { type: "error", text: "Error Signing In" },
        });
        dispatch({ type: "isLoading", payload: false });
      }
    } catch (error) {
      if (error.response) {
        dispatch({
          type: "setMessage",
          payload: {
            type: "error",
            text:
              error.response.data?.message || "Login failed. Please try again.",
          },
        });
      } else if (error.request) {
        dispatch({
          type: "setMessage",
          payload: {
            type: "error",
            text: "No response from server. Please check your internet or try again later.",
          },
        });
      } else {
        dispatch({
          type: "setMessage",
          payload: {
            type: "error",
            text: "Unexpected error occurred. Please refresh the page and try again.",
          },
        });
      }
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
      <div className={`userFlow-status ${state.message.type}`}>
        <p>{state.message.text}</p>
      </div>
      <Link to="/user-signUp" className="minimal-link">
        No Account? Sign Up Now
      </Link>
    </div>
  );
}

export default LoginPage;
