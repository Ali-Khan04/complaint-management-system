import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserComplain from "./pages/UserComplain";
import StaffLogin from "./pages/staffLogin";
import StaffDashBoard from "./pages/StaffDashBoard";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/user-dashboard" element={<UserComplain />} />
      <Route path="/admin-login" element={<StaffLogin />} />
      <Route path="/admin-dashboard" element={<StaffDashBoard />} />
    </Routes>
  );
}

export default App;
