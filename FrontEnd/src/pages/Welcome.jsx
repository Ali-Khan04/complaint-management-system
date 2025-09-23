import { useNavigate } from "react-router-dom";
import "../CSS/WelcomePage.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="feature-left">
        <div className="feature-card">
          <h3>Quick Access</h3>
          <p>Submit and track your complaints with ease</p>
        </div>
      </div>

      <div className="main-content">
        <h1>Welcome to the Complaint Portal</h1>
        <p>Manage and review complaints easily</p>
        <div className="welcome-buttons">
          <button onClick={() => navigate("/user-signUp")}>User Sign In</button>
          <button onClick={() => navigate("/admin-login")}>
            Admin Sign In
          </button>
        </div>
      </div>

      <div className="feature-right">
        <div className="feature-card">
          <h3>Admin Dashboard</h3>
          <p>Comprehensive tools for complaint management</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
