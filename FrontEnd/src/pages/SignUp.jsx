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
        "http://localhost:3000/user-portal/signup",
        { userId, name, email, password },
        { withCredentials: true }
      );
      const data = response.data;

      if (response.status === 201 && data.success) {
        dispatch({
          type: "setMessage",
          payload: { type: "success", text: "Sign Up Successfull!" },
        });
        dispatch({ type: "isLoading", payload: false });
        setTimeout(() => {
          navigate("/user-login");
        }, 1000);
      } else {
        dispatch({
          type: "setMessage",
          payload: { type: "error", text: "Error Signing Up!" },
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
              error.response.data?.message ||
              "SignUp failed. Please try again.",
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
      <div className={`userFlow-status ${state.message.type}`}>
        <p>{state.message.text}</p>
      </div>
      <Link to="/user-login" className="minimal-link">
        Have an Account? Sign In
      </Link>
    </div>
  );
}

export default SignUpPage;
