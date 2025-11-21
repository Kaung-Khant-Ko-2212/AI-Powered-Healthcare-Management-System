import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DoctorDetailCard.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Sidebar from "./Sidebar";

function DoctorDetailCard({ doctorId, onClose }) {
  const [doctor, setDoctor] = useState(null);
  const [locations, setLocations] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0); // New state for unique patients
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        // Fetch doctor details
        const doctorResponse = await axios.get(`http://localhost:8080/api/doctors/${doctorId}`);
        console.log("Doctor Response:", doctorResponse.data);
        setDoctor(doctorResponse.data || {});

        // Fetch schedules using the correct endpoint
        const scheduleResponse = await axios.get(`http://localhost:8080/api/doctor-schedule/doctor/${doctorId}/locations`);
        console.log("Schedule Response:", scheduleResponse.data);
        // Handle different response structures (array or object with data field)
        let scheduleData = scheduleResponse.data;
        if (scheduleData && typeof scheduleData === 'object' && !Array.isArray(scheduleData)) {
          scheduleData = scheduleData.data || []; // Handle { data: [], message: "Success" }
        }
        const schedules = Array.isArray(scheduleData) ? scheduleData : [];
        setLocations(schedules.map(schedule => ({
          id: schedule.id || 0,
          hospital: schedule.hospital || null,
          clinic: schedule.clinic || null,
          dayOfWeek: schedule.dayOfWeek || "N/A",
          startTime: schedule.startTime || "00:00:00",
          endTime: schedule.endTime || "00:00:00",
        })) || []);

        // Fetch total unique patients from appointments
        const patientResponse = await axios.get(`http://localhost:8080/api/appointments/doctor/${doctorId}/patients/count`);
        setTotalPatients(patientResponse.data || 0);
      } catch (err) {
        console.error("Error fetching doctor details:", err.response ? err.response.data : err.message);
        setError("Failed to load doctor details or schedule: " + (err.response ? err.response.statusText : "Network error"));
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  if (!doctorId) return null;
  if (loading) return <p>Loading doctor details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!doctor) return <p>No doctor data available.</p>;

  const dayShortMap = {
    "SUNDAY": "SUN",
    "MONDAY": "MON",
    "TUESDAY": "TUE",
    "WEDNESDAY": "WED",
    "THURSDAY": "THU",
    "FRIDAY": "FRI",
    "SATURDAY": "SAT"
  };

  return (
    <div>
      <Sidebar />
      <div className="doctor-detail-card3">
        <div className="doctor-detail-content3">
          <div className="close-btn3" onClick={onClose}>✖</div>
          <div className="doctor-info3">
            <div className="human-icon3">
              <AccountCircleIcon sx={{ fontSize: 50 }} />
            </div>
            <div className="left-side3">
              <p className="question3">Doctor Name</p>
              <p className="answer3">{doctor.name || "N/A"}</p>
              <p className="question3">Phone</p>
              <p className="answer3">{doctor.phoneNumber || "N/A"}</p>
              <p className="question3">Total Experience</p>
              <p className="answer3">{doctor.experience || "N/A"}</p>
              <p className="question3">Degree</p>
              <p className="answer3">{doctor.degree || "N/A"}</p>
            </div>
            <div className="right-side3">
              <p className="question3">Specialization</p>
              <p className="answer3">{doctor.specialty?.name || "N/A"}</p>
              <p className="question3">Email</p>
              <p className="answer3">{doctor.email || "N/A"}</p>
              <p className="question3">Total Patients</p>
              <p className="answer3">{totalPatients || "0"}</p>
              <p className="question3">Schedule</p>
              {locations.length > 0 ? (
                <ul style={{ paddingLeft: 0 }}>
                  {Object.values(
                    locations.reduce((acc, location) => {
                      const locationName = location.hospital?.name || location.clinic?.name || "Unknown Location";
                      const timeKey = `${locationName}-${location.startTime}-${location.endTime}`;
                      if (!acc[timeKey]) {
                        acc[timeKey] = {
                          hospital: location.hospital,
                          clinic: location.clinic,
                          name: locationName,
                          startTime: location.startTime,
                          endTime: location.endTime,
                          days: [],
                        };
                      }
                      const dayShort = dayShortMap[location.dayOfWeek.toUpperCase()] || location.dayOfWeek;
                      if (dayShort && !acc[timeKey].days.includes(dayShort)) {
                        acc[timeKey].days.push(dayShort);
                      }
                      return acc;
                    }, {})
                  ).map((groupedLocation, index) => (
                    <li key={index}>
                      <div className="location-list3">
                        <p className="answer3">{groupedLocation.name}</p>
                        <p className="schedule3">
                          {groupedLocation.days.sort().join(", ")}<br />
                          {groupedLocation.startTime} - {groupedLocation.endTime}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No locations available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetailCard;