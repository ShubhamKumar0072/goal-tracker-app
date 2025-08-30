import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@mui/material/Button";
import "./LogOut.css";

// filepath: c:\1.My Files\Programing\Projects\goal-tracker-app\client\src\Pages\LogOut\LogOut.jsx
export default function LogOut() {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  function handleLogout() {
    window.location.href = "https://goal-tracker-app-backend-3tnq.onrender.com/logout";
  }

  function handleCancel() {
    navigate("/");
  }

  return (
    <div className="logout-container">
      <h2>Are you sure you want to log out?</h2>
      <div className="logout-btn-group">
        <Button variant="contained" color="error" onClick={handleLogout}>
          Yes, Log Out
        </Button>
        <Button variant="outlined" color="primary" onClick={handleCancel} sx={{ ml: 2 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
}