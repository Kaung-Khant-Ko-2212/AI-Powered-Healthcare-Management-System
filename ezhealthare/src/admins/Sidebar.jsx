import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUserMd, FaCalendarAlt, FaUser, FaNewspaper, FaSignOutAlt } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import "./Sidebar.css";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      console.log("Logging out");
      localStorage.clear(); // Clear all local storage (userId, token, etc.)
      navigate('/'); // Redirect to homepage or login page
    } else {
      console.log("Logout canceled");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/images/EZhealthcare.png" alt="HealthCare Logo" className="logo2" />
        <span className="brand-name">Health<span style={{ color: "white" }}>Care</span></span>
      </div>
      <ul className="sidebar-menu">
        <li className="menu-item sidebar-menu-item2">
          <Link to="/adminDashboard" className="link2">
            <FaTachometerAlt className="menu-icon" />
            Dashboard
          </Link>
        </li>

        <li className="menu-item sidebar-menu-item2">
          <Link to="/ConfirmAppointment" className="link2">
            <FaCalendarAlt className="menu-icon" />
            Appointment
          </Link>
        </li>

        <li className="menu-item sidebar-menu-item2">
          <Link to="/adminPatient" className="link2">
            <FaUser className="menu-icon" />
            Patient
          </Link>
        </li>

        {/* Doctor Dropdown */}
        <li className="menu-item sidebar-menu-item2" onClick={() => toggleDropdown("doctor")}>
          <div className="menu-title">
            <FaUserMd className="menu-icon" />
            <span>Doctor</span>
            {openDropdown === "doctor" ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
          </div>
          {openDropdown === "doctor" && (
            <ul className="submenu">
              <li>
                <Link to="/doctor-list" className="link2">Doctor List</Link>
              </li>
              <li>
                <Link to="/create-new-doctor" className="link2">Create New Doctor</Link>
              </li>
              <li>
                <Link to="/doctors-requests" className="link2">Doctors’ Requests</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Article Dropdown */}
        <li className="menu-item sidebar-menu-item2" onClick={() => toggleDropdown("article")}>
          <div className="menu-title">
            <FaNewspaper className="menu-icon" />
            Article
            {openDropdown === "article" ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
          </div>
          {openDropdown === "article" && (
            <ul className="submenu">
              <li>
                <Link to="/article-list" className="link2">Article List</Link>
              </li>
              <li>
                <Link to="/add-new-article" className="link2">Add New Article</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Logout Item */}
        <li className="menu-item sidebar-menu-item2">
          <div className="link2" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <FaSignOutAlt className="menu-icon" />
            Logout
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;