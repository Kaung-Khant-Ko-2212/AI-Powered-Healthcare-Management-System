import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './NotificationDropdown.css'; // Ensure this CSS file includes styles for both components
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
        <img src="/images/EZhealthcare.png" alt="EZ Healthcare Logo" /> {/* Corrected path */}
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

// ProfileEditPage Component
const ProfileEditPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/auth/${userId}`)
      .then((response) => {
        setUser(response.data);
        return axios.get(`http://localhost:8080/auth/${userId}/profile-image`);
      })
      .then((res) => {
        if (res.status === 200) {
          console.log('Profile image URL:', res.data);
          setPreview(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", user.fullName || "");
    formData.append("username", user.username || "");
    formData.append("email", user.email || "");
    formData.append("password", user.password || "");
    formData.append("age", user.age || "");
    formData.append("gender", user.gender || "");
    if (image) {
      formData.append("profileImage", image);
    }
  
    try {
      await axios.put(`http://localhost:8080/auth/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully!");
      navigate(`/profile/${userId}`, { state: { refresh: true } });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <>
      <Usernavbar />
      <div className="profile-edit-page5" style={{ marginTop: "70px" }}>
        <h2>Update Your Profile Information</h2>
        <form className="edit-form5" onSubmit={handleSubmit} encType="multipart/form-data">
          <label>
            Full Name
            <input type="text" name="fullName" value={user.fullName || ''} onChange={handleChange} />
          </label>
          <label>
            Username
            <input type="text" name="username" value={user.username || ''} onChange={handleChange} />
          </label>
          <label>
            Email
            <input type="email" name="email" value={user.email || ''} onChange={handleChange} />
          </label>
          {/* <label>
            Password
            <input type="password" name="password" value={user.password || ''} onChange={handleChange} />
          </label> */}
          <label>
            Age
            <input type="number" name="age" value={user.age || ''} onChange={handleChange} />
          </label>
          <label>
            Gender
            <input type="text" name="gender" value={user.gender || ''} onChange={handleChange} />
          </label>
          {/* <label>
            Profile Image
            <input type="file" name="profileImage" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Profile Preview" style={{ maxWidth: "100px", maxHeight: "100px", marginTop: "10px" }} />
              </div>
            )}
          </label> */}
          <div className="form-buttons">
            <button type="button" onClick={() => navigate(`/profile/${userId}`)} style={{ marginRight: "30px" }}>Cancel</button>
            <button type="submit">Update</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileEditPage;