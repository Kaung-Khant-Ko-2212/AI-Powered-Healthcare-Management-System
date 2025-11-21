import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './NotificationDropdown.css'; // Ensure this CSS file is correctly imported
import { FaBell, FaRegClock, FaMapMarkerAlt, FaEdit, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

// Usernavbar Component
const Usernavbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [viewedNotifications, setViewedNotifications] = useState(new Set());
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  console.log("Navbar userId:", userId);

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    if (!userId || !token) {
      console.warn("Missing userId or token, skipping fetch");
      return;
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId, token]);

  const fetchNotifications = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [notificationsRes, countRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/notifications/user/${userId}`, config),
        axios.get(`http://localhost:8080/api/notifications/user/${userId}/count`, config),
      ]);
      setNotifications(notificationsRes.data);
      setUnreadCount(countRes.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async () => {
    if (!showNotifications) {
      setShowNotifications(true);
    } else {
      const newViewedNotifications = new Set(viewedNotifications);
      notifications.forEach(notification => {
        if (!notification.isRead) {
          newViewedNotifications.add(notification.id);
        }
      });
      setViewedNotifications(newViewedNotifications);

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.post(`http://localhost:8080/api/notifications/user/${userId}/mark-all-read`, {}, config);
        fetchNotifications();
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-icon')) {
        setShowNotifications(false);
      }
      if (!event.target.closest('.profile4')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showProfileDropdown]);

  const isNotificationUnviewed = (notification) => {
    return !notification.isRead && !viewedNotifications.has(notification.id);
  };

  if (!userId) {
    return null; // Or render a minimal navbar for unauthenticated users
  }

  return (
    <div className="navbar">
      <div className="logo">
        <img src="/images/EZhealthcare.png" alt="EZ Healthcare Logo" /> {/* Adjusted path */}
        <span style={{ fontSize: '28px', fontWeight: 400, color: '#000000', fontFamily: 'Arial, sans-serif' }}>Health</span>
        <span style={{ fontSize: '28px', fontWeight: 400, color: '#ffffff', fontFamily: 'Arial, sans-serif' }}>Care</span>
      </div>
      <div className="nav-links">
        <Link to="/Userdashboard">Home</Link>
        <Link to="/specialists">Specialists</Link>
        <Link to="/article-user">Article</Link>
        <Link to="/useraboutus">About Us</Link>
        <Link to="/userfaq">FAQ</Link>
        <div className="notification-icon" onClick={handleNotificationClick}>
          <FaBell size={20} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <span>Notifications</span>
                <Link to="/your-appointments" className="view-all">View Details</Link>
              </div>
              {notifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-content">
                    <div className={`notification-title ${notification.status}`}>
                      {isNotificationUnviewed(notification) && <span className="unread-indicator" />}
                      {notification.title}
                    </div>
                    <div className="notification-details">
                      <div className="time-detail">
                        <FaRegClock className="icon" />
                        <span>{notification.appointmentDateTime}</span>
                      </div>
                      <div className="location-detail">
                        <FaMapMarkerAlt className="icon" />
                        <span>{notification.appointmentLocation || 'Location not available'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile4">
          <div onClick={() => {
            console.log("Profile icon clicked");
            setShowProfileDropdown(!showProfileDropdown);
          }}>
            <FaUserCircle size={30} style={{ color: '#000000', cursor: 'pointer' }} />
          </div>
          {showProfileDropdown && (
            <div className="profile-dropdown4">
              <Link 
                to={`/profile/${userId}`} 
                className="dropdown-item4" 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Edit Profile link clicked");
                }}
              >
                <FaEdit size={17} style={{ color: '#666' }} />
                <div>
                  <span style={{ color: '#666', fontSize: '16px', marginBottom: '4px' }}>Edit Profile</span>
                </div>
              </Link>
              <div className="dropdown-item4" onClick={(e) => {
                e.stopPropagation();
                console.log("Logout clicked");
                handleLogout();
              }}>
                <FaSignOutAlt size={17} style={{ color: '#666' }} />
                <span style={{ color: '#666', fontSize: '16px', marginBottom: '4px' }}>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ProfilePage Component
const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [imageUpdated, setImageUpdated] = useState(Date.now());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/auth/${userId}`);
        console.log("Fetched user data:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }
    };

    fetchUserData();
  }, [userId, imageUpdated]);

  useEffect(() => {
    const handleNavigationRefresh = () => {
      setImageUpdated(Date.now());
    };

    window.addEventListener("focus", handleNavigationRefresh);
    return () => window.removeEventListener("focus", handleNavigationRefresh);
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Usernavbar />
      <div className="profile-page5" style={{ marginTop: "70px" }}>
        <div className="profile-header5">
          <button
            className="profile-edit-btn5"
            onClick={() => navigate(`/profile/${userId}/edit`)}
          >
            Edit Profile
          </button>
        </div>
        <table className="profile-table5">
          <tbody>
            <tr>
              <td>Full Name</td>
              <td>{user.fullName || "N/A"}</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>{user.username || "N/A"}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{user.email || "N/A"}</td>
            </tr>
            {/* <tr>
              <td>Password</td>
              <td>********</td>
            </tr> */}
            <tr>
              <td>Age</td>
              <td>{user.age || "N/A"}</td>
            </tr>
            <tr>
              <td>Gender</td>
              <td>{user.gender || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProfilePage;