import React, { useState, useEffect } from "react";
import AppointmentItem from "./AppointmentItem";
import "../styles/AppointmentList.css";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Retrieve doctorId from localStorage
        const doctorId = localStorage.getItem("doctorId");

        if (!doctorId) {
          console.warn("Doctor ID is missing! Please log in again.");
          setLoading(false);
          return;
        }

        setLoading(true);
        console.log(`Fetching appointments for Doctor ID: ${doctorId}`);

        const response = await fetch(`http://localhost:8080/api/appointments/doctor/${doctorId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
          },
        });
        console.log("Response status:", response.status);

        if (!response.ok) throw new Error("Failed to fetch appointments");

        const data = await response.json();
        console.log("Fetched Appointments:", data);

        // Get today's date (ignoring time for comparison)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate date comparison

        // Filter for CONFIRMED and upcoming appointments
        const upcomingConfirmedAppointments = data.filter((appointment) => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return (
            appointment.status === "CONFIRMED" &&
            appointmentDate >= today
          );
        });

        setAppointments(upcomingConfirmedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []); // Removed doctorId from dependency array since it's no longer a variable

  return (
    <div className="appointment-list3">
      <h3>Upcoming Confirmed Appointments for Doctor</h3>
      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length > 0 ? (
        appointments.map((appointment) => (
          <AppointmentItem key={appointment.id} appointment={appointment} />
        ))
      ) : (
        <p>No upcoming confirmed appointments available for this doctor.</p>
      )}
    </div>
  );
};

export default AppointmentList;