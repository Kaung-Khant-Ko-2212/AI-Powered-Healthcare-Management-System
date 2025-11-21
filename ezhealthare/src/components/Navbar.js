import React, { useState } from 'react'; // ✅ Add useState import
import { Link } from 'react-router-dom';
import './Navbar.css'; // ✅ Import CSS for styling

const Navbar = () => {
    const [open, setOpen] = useState(false); // ✅ Define state correctly
    const [showLoginDropdown, setShowLoginDropdown] = useState(false);

  // Define the handler for logging out
    const handleLogout = () => {
        // Your logout logic here, for example clearing the session or token
        console.log('User logged out');
    };

    return (
        <div className="navbar" style={{position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
            <div className="logo">
                <img src="images/EZhealthcare.png" alt="logo" />
                <span style={{ fontSize: '28px', fontWeight: 400, color: '#000000', fontFamily: 'Arial, sans-serif' }}>Health</span>
                <span style={{ fontSize: '28px', fontWeight: 400, color: '#ffffff', fontFamily: 'Arial, sans-serif' }}>Care</span>
            </div>

            <div className="nav-links">
                <Link to="/">Home</Link>
                {/* <Link to="/adminDashboard">Admin</Link>
                <Link to="/doctorDashboard">Doctor</Link> */}
                <Link to="/aboutus">About Us</Link>
                <Link to="/faq">FAQ</Link>

                <div className="relative">  {/* ✅ Ensures dropdown is positioned correctly */}
                    <button onClick={() => setShowLoginDropdown(!showLoginDropdown)}>
                        Login
                    </button>

                    {showLoginDropdown && (
                        <div className="login-dropdown">
                        <div className="login-header">
                            <Link to="/login" className="view-profile">
                            User/Admin Login
                            </Link>
                        </div>
                        <div className="login-header">
                            <Link to="/doctorlogin" className="view-profile">
                            Doctor Login
                            </Link>
                        </div>
                        </div>
                    )}
                </div>
                <Link to="/signup" className="btn-signup2">Sign Up</Link>
            </div>
        </div>
    );
};

export default Navbar; // ✅ Correctly export at the bottom
