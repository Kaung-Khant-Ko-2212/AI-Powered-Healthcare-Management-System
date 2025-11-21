import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row } from "react-bootstrap";
import { FaHospital, FaHospitalAlt, FaBell, FaRegClock, FaMapMarkerAlt, FaEdit, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import './DoctorInfo.css'; // Assuming this includes navbar styles too
import './NotificationDropdown.css'; // Include navbar-specific styles
import AvailableDateBox from "./AvailableDateBox";

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

// DoctorInfo Component
const DoctorInfo = () => {
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const { doctorId } = useParams();
  const { state } = useLocation();
  const [userId, setUserId] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationType, setLocationType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (state && state.userId) {
      setUserId(state.userId);
    } else {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        console.warn("No userId found. Redirecting to login.");
      }
    }
    console.log("User ID in DoctorInfo:", userId);
  }, [state]);

  useEffect(() => {
    const fetchDoctorLocations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/doctors/${doctorId}/locations`);
        setDoctor(response.data.doctor);
        setHospitals(response.data.hospitals || []);
        setClinics(response.data.clinics || []);
      } catch (err) {
        setError('Error fetching doctor information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctorLocations();
    }
  }, [doctorId]);

  const handleLocationSelect = (location, type) => {
    setSelectedLocation(location);
    setLocationType(type);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!doctor) return <div>No doctor information available</div>;

  return (
    <div className="doctor-info-container">
      <Usernavbar />
      <div className="bg-gray-100 py-5">
        {doctor ? (
          <div className="flex flex-col md:flex-row items-center gap-20 p-6 max-w-4xl mx-auto">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <img 
                src="/images/threeCircle.png" 
                alt="Background" 
                className="absolute inset-0 w-full object-cover" 
                style={{ marginTop: '20px' }} 
              />
              {/* Uncomment and fix if doctor image is needed */}
              {/* <img 
                src={`/images/${doctor.image}`} 
                alt={doctor.name} 
                className="relative w-full h-full object-cover" 
                style={{ marginLeft: '20px', width: 'auto', height: '260px', marginTop: '33px' }} 
              /> */}
            </div>
            <div className="flex flex-col max-w-md">
              <h3 className="text-xl md:text-3xl font-bold text-blue-900" style={{ color: '#0F4C8D', marginBottom: '10px' }}>
                {doctor.name}
              </h3>
              <p className="text-gray-600 text-lg font-bold" style={{ textAlign: 'left', marginBottom: '0px' }}>
                {doctor.specialty?.name || "Unknown Specialty"}
              </p>
              <div className="bg-gray-100 p-4 shadow-md mt-3 border border-blue-500">
                <p className="flex items-center gap-2 text-gray-700 text-20" style={{ textAlign: 'left' }}>
                  <FontAwesomeIcon icon={faGraduationCap} />
                  {doctor.degree || "Unknown Degree"}
                </p>
                <p className="flex items-center gap-2 text-gray-700 text-sm mt-2">
                  <FontAwesomeIcon icon={faBriefcase} />
                  <strong>Total Experience:</strong> {doctor.experience || "Unknown"} Years
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg text-gray-700">Doctor details not found.</p>
        )}
      </div>

      <Container className="mt-5">
        <Row className="justify-content-center">
          {hospitals.length > 0 ? (
            <div className="hospitals-section">
              <h3 style={{ marginBottom: '0px' }}>Hospitals</h3>
              <div className="locations-grid">
                {hospitals.map(hospital => (
                  <div
                    key={hospital.id}
                    className={`location-card ${
                      selectedLocation?.id === hospital.id && locationType === 'hospital' ? 'selected' : ''
                    }`}
                    onClick={() => handleLocationSelect(hospital, 'hospital')}
                  >
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div>
                        <FaHospital className="location-icon" />
                      </div>
                      <div>
                        <h4 className="location-name">{hospital.name}</h4>
                        <p className="location-address">{hospital.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-lg text-gray-700">No hospitals available for this doctor.</p>
          )}
        </Row>
      </Container>

      <Container className="mt-5">
        <Row className="justify-content-center">
          {clinics.length > 0 ? (
            <div className="clinics-section">
              <h3 style={{ marginBottom: '0px' }}>Clinics</h3>
              <div className="locations-grid">
                {clinics.map(clinic => (
                  <div
                    key={clinic.id}
                    className={`location-card ${
                      selectedLocation?.id === clinic.id && locationType === 'clinic' ? 'selected' : ''
                    }`}
                    onClick={() => handleLocationSelect(clinic, 'clinic')}
                  >
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div>
                        <FaHospitalAlt className="location-icon" />
                      </div>
                      <div>
                        <h4 className="location-name">{clinic.name}</h4>
                        <p className="location-address">{clinic.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-lg text-gray-700"></p>
          )}
        </Row>
      </Container>

      {selectedLocation && (
        <AvailableDateBox
          doctorId={doctorId}
          locationId={selectedLocation.id}
          locationType={locationType}
          userId={userId}
        />
      )}
    </div>
  );
};

export default DoctorInfo;