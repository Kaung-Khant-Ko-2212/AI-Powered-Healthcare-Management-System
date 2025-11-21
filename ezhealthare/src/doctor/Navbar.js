import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi'; // Import the logout icon
import './Navbar.css'; // Import your CSS file for styling

const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Logout handler with confirmation
  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    
    // Proceed with logout only if user clicks "OK"
    if (confirmLogout) {
      // Clear localStorage (remove token and doctorId)
      localStorage.removeItem("token");
      localStorage.removeItem("doctorId");

      // Redirect to login page
      navigate("/"); // Adjust the path to your login route
    }
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src="images/EZhealthcare.png" alt="logo" />
        <span style={{ fontSize: '28px', fontWeight: 400, color: '#000000', fontFamily: 'Arial, sans-serif' }}>Health</span>
        <span style={{ fontSize: '28px', fontWeight: 400, color: '#ffffff', fontFamily: 'Arial, sans-serif' }}>Care</span>
      </div>
      <div className="nav-links">
        <Link to="/DoctorDashboard">Dashboard</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/schedule">Schedule</Link>
        {/* Replace "Article" with Logout Icon */}
        <span onClick={handleLogout} className="logout-icon" style={{ cursor: 'pointer' }}>
          <FiLogOut size={24} /> {/* Adjust size as needed */}
        </span>
      </div>
    </div>
  );
};

export default Navbar;