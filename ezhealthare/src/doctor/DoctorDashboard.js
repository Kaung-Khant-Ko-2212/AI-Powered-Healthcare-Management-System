import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import StatsCard from "./StatsCard";
import ChartCard from "./ChartCard";
import AppointmentList from "./AppointmentList";
import "../styles/DoctorDashboard.css";

const DoctorDashboard = () => {
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [doctorId, setDoctorId] = useState(null); // State to hold doctorId

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Retrieve doctorId from localStorage
        const storedDoctorId = localStorage.getItem("doctorId");

        if (!storedDoctorId) {
          throw new Error("Doctor ID is missing. Please log in again.");
        }

        // Set doctorId in state
        setDoctorId(storedDoctorId);

        // Fetch total appointments for the logged-in doctor
        const appointmentsResponse = await fetch(
          `http://localhost:8080/api/appointments/doctor/${storedDoctorId}/count`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
            },
          }
        );
        if (!appointmentsResponse.ok) {
          throw new Error(`HTTP error fetching appointments! status: ${appointmentsResponse.status}`);
        }
        const appointmentsData = await appointmentsResponse.json();
        setTotalAppointments(appointmentsData);

        // Fetch total distinct patients for the logged-in doctor
        const patientsResponse = await fetch(
          `http://localhost:8080/api/appointments/doctor/${storedDoctorId}/patients/count`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!patientsResponse.ok) {
          throw new Error(`HTTP error fetching patients! status: ${patientsResponse.status}`);
        }
        const patientsData = await patientsResponse.json();
        setTotalPatients(patientsData);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setTotalPatients(0); // Fallback to 0 on error
        setTotalAppointments(0); // Fallback to 0 on error
        setDoctorId(null); // Reset doctorId on error
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="dashboard-container3">
        <div className="main-container3">
          <div className="left3">
            <div className="stats-section3">
              <StatsCard icon="👩‍⚕️" title="Total Patient" value={totalPatients} />
              <StatsCard icon="📅" title="Total Appointment" value={totalAppointments} />
            </div>
            <div className="chart-section3">
              {/* Pass the dynamic doctorId to ChartCard */}
              {doctorId ? <ChartCard doctorId={doctorId} /> : <p>Loading chart...</p>}
            </div>
          </div>
          <div className="right3">
            <AppointmentList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;