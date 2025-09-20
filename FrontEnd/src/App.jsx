import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserComplain from "./pages/UserComplain";
import StaffLogin from "./pages/staffLogin";
import StaffDashBoard from "./pages/StaffDashBoard";
import ViewComplain from "./pages/viewComplain";
import Welcome from "./pages/Welcome";
import SignUpPage from "./pages/SignUp";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/user-login" element={<LoginPage />} />
      <Route path="/user-signUp" element={<SignUpPage />} />
      <Route path="/user-dashboard" element={<UserComplain />} />
      <Route path="/admin-login" element={<StaffLogin />} />
      <Route path="/admin-dashboard" element={<StaffDashBoard />} />
      <Route path="/viewComplains" element={<ViewComplain />} />
    </Routes>
  );
}

export default App;
