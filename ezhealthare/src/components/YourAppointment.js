import React, { useState, useEffect } from "react";
import axios from "axios";
import "./YourAppointment.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Usernavbar from "./Usernavbar";

const YourAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("PENDING");
  const userId = localStorage.getItem("userId"); // Ensure userId is correctly set

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/appointments/user/${userId}`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:8080/api/appointments/${appointmentId}/status`, {
        status: "CANCELLED",
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.status === activeTab
  );

  const getLocationName = (appointment) => {
    if (appointment.hospital) {
      return appointment.hospital.name;
    }
    if (appointment.clinic) {
      return appointment.clinic.name;
    }
    return "Location not available";
  };

  return (
    <>
      <Usernavbar />
      <div className="appointments-container" style={{ marginTop: '80px' }}>
        <main>
          <h2>My Appointments</h2>
          <div className="appointment-tabs">
            <button
              className={`tab-button ${activeTab === "PENDING" ? "active" : ""}`}
              onClick={() => setActiveTab("PENDING")}
            >
              Pending
            </button>
            <button
              className={`tab-button ${activeTab === "CONFIRMED" ? "active" : ""}`}
              onClick={() => setActiveTab("CONFIRMED")}
            >
              Confirmed
            </button>
            <button
              className={`tab-button ${activeTab === "CANCELLED" ? "active" : ""}`}
              onClick={() => setActiveTab("CANCELLED")}
            >
              Cancelled
            </button>
          </div>
          <div className="appointments-list">
            {filteredAppointments.map((appointment) => (
              <div className="appointment-card" key={appointment.id}>
                <div className="doctor-info">
                  {/* <img
                    src={`/images/${appointment.doctor?.image || 'default-doctor.jpg'}`}
                    alt={appointment.doctor?.name || "Doctor Image"}
                    
                    className="doctor-image"
                  /> */}
                  <div className="appointment-details flex-grow-1">
                    <div className="card-titles">{appointment.doctor?.name || "Doctor name not available"}</div>
                    <div className="date-and-location">
                      <div className="card-texts">
                        <i className="bi bi-calendar3 icon-color"></i>
                        {appointment.appointmentDate &&
                          new Date(appointment.appointmentDate).toLocaleDateString()}{" "}
                        - {appointment.appointmentTime}
                      </div>
                      <div className="card-texts location">
                        <i className="bi bi-geo-alt-fill icon-color"></i>
                        {getLocationName(appointment)}
                      </div>
                    </div>
                  </div>
                </div>
                {activeTab === "PENDING" && (
                  <button className="cancel-button" onClick={() => handleCancelAppointment(appointment.id)}>
                    Cancel
                  </button>
                )}
              </div>
            ))}
            {filteredAppointments.length === 0 && (
              <div className="no-appointments">No {activeTab.toLowerCase()} appointments found</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default YourAppointment;
