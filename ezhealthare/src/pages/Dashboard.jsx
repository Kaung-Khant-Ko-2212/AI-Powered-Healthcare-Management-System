import React, { useEffect, useState } from "react";
import DashboardCards from "../admins/DashboardCards";
import ChartGenderStats from "../admins/ChartGenderStats";
import Sidebar from "../admins/Sidebar";
import "./Dashboard.css";

const Dashboard = () => {
  const [totalPatients, setTotalPatients] = useState(0); // State for total patients
  const [totalDoctors, setTotalDoctors] = useState(0); // State for total doctors

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total patients
        const patientsResponse = await fetch(
          "http://localhost:8080/api/dashboard/appointment/count"
        );
        const patientsData = await patientsResponse.json();
        setTotalPatients(patientsData.totalAppointments || 0);

        // Fetch total doctors
        const doctorsResponse = await fetch(
          "http://localhost:8080/api/dashboard/doctors/count"
        );
        const doctorsData = await doctorsResponse.json();
        setTotalDoctors(doctorsData.totalDoctors || 0);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container2">
      {/* Sidebar */}
      <Sidebar />

      <div className="dashboard2">
        <div className="dashboard-cards2">
          {/* Display total patients */}
          <div className="dashboard-card">
            <h3>Total Patients</h3>
            <p>{totalPatients}</p>
          </div>

          {/* Display total doctors */}
          <div className="dashboard-card">
            <h3>Total Doctors</h3>
            <p>{totalDoctors}</p>
          </div>
        </div>

        <div className="dashboard-charts2">
          <ChartGenderStats />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;