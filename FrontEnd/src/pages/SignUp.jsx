import axios from "axios";
import "../CSS/LoginPage.css";
import "../CSS/loginResponsiveness.css";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";
function SignUpPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useUser();
  const handleChange = (e) => {
    dispatch({
      type: "SignUp",
      payload: { id: e.target.id, value: e.target.value },
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "isLoading", payload: true });
    const { userId, name, email, password } = state.SignUp;
    try {
      const response = await axios.post(
        "http://localhost:3000/user-portal/signin",
        { userId, name, email, password },
        { withCredentials: true }
      );
      const data = response.data;

      if (response.ok && data.success) {
        dispatch({ type: "SuccessMessage", payload: true });
        dispatch({ type: "ErrorMessage", payload: false });
        dispatch({ type: "isLoading", payload: false });
        setTimeout(() => {
          navigate("/user-login");
        }, 1000);
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
      <h2>Customer SignUp Portal</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="userId"
          placeholder="Enter your ID"
          value={state.SignUp.userId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          id="name"
          placeholder="Enter your Name"
          value={state.SignUp.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          id="email"
          placeholder="Enter your Email"
          value={state.SignUp.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={state.SignUp.password}
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
      <Link to="/user-login" className="minimal-link">
        Have an Account? Sign In
      </Link>
    </div>
  );
}

export default SignUpPage;
