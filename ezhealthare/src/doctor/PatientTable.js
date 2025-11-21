import React, { useState, useEffect } from "react";
import "../styles/PatientTable.css";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

const PatientTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [locations, setLocations] = useState([]); // Combined unique hospitals and clinics

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorId = localStorage.getItem("doctorId") || "1"; // Fallback to "1" if not found

        // Fetch doctor's hospitals and clinics
        const locationResponse = await fetch(`http://localhost:8080/api/doctors/${doctorId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token if required
          },
        });
        if (!locationResponse.ok) {
          throw new Error(`HTTP error fetching doctor details! status: ${locationResponse.status}`);
        }
        const doctorData = await locationResponse.json();

        // Deduplicate hospital names
        const hospitalSet = new Set((doctorData.hospitals || []).map(h => h.name));
        const uniqueHospitalNames = Array.from(hospitalSet);

        // Deduplicate clinic names
        const clinicSet = new Set((doctorData.clinics || []).map(c => c.name));
        const uniqueClinicNames = Array.from(clinicSet);

        // Combine unique hospital and clinic names
        const combinedLocations = [...uniqueHospitalNames, ...uniqueClinicNames];
        setLocations(combinedLocations);

        // Fetch appointments
        const response = await fetch(`http://localhost:8080/api/appointments/doctor/${doctorId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error fetching appointments! status: ${response.status}`);
        }
        const data = await response.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const mappedPatients = data
          .filter((appointment) => appointment.status === "CONFIRMED")
          .map((appointment) => {
            const appointmentDate = new Date(appointment.appointmentDate);
            return {
              name: appointment.user?.fullName || "Unknown",
              age: appointment.user?.age || 0,
              gender: appointment.user?.gender || "Unknown",
              appointment: `${appointment.appointmentDate} - ${appointment.appointmentTime.slice(0, 5)}`,
              status: appointmentDate >= today ? "Upcoming" : "Completed",
              hospital: appointment.hospital?.name || appointment.clinic?.name || "N/A",
              appointmentDate: appointment.appointmentDate,
              ageGroup:
                appointment.user?.age <= 12
                  ? "Child"
                  : appointment.user?.age <= 19
                  ? "Teen"
                  : "Adult",
            };
          });

        mappedPatients.sort((a, b) => a.appointment.localeCompare(b.appointment));
        setAllPatients(mappedPatients);
        setFilteredPatients(mappedPatients);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterData(e.target.value, selectedHospital, selectedDate);
  };

  const handleHospitalChange = (e) => {
    setSelectedHospital(e.target.value);
    filterData(searchTerm, e.target.value, selectedDate);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    filterData(searchTerm, selectedHospital, e.target.value);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedHospital("");
    setSelectedDate("");
    setFilteredPatients(allPatients); // Reset to all fetched patients
  };

  const filterData = (name, hospital, date) => {
    const filtered = allPatients.filter((patient) => {
      const matchesName =
        name === "" || patient.name.toLowerCase().includes(name.toLowerCase());
      const matchesHospital =
        hospital === "" || patient.hospital === hospital;
      const matchesDate =
        date === "" || patient.appointmentDate === date;
      return matchesName && matchesHospital && matchesDate;
    });
    setFilteredPatients(filtered);
  };

  return (
    <div className="patient-table-container3" >
      <div className="patient-header3">
        <h1 className="title3" style={{ textAlign: "left" }}>
          Patient
        </h1>
        <p className="subtitle3" style={{ textAlign: "left" }}>
          View confirmed patient profiles
        </p>
      </div>
      <div className="patient-body3">
        <div className="controls3">
          <TextField
            placeholder="Search patients..."
            variant="outlined"
            className="search-input3"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "white",
              height: "40px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                paddingLeft: "10px",
              },
              "& .MuiInputBase-input": {
                height: "1.5rem",
                padding: "10px",
              },
            }}
          />
          <TextField
            type="date"
            variant="outlined"
            className="date-input3"
            value={selectedDate}
            onChange={handleDateChange}
            sx={{
              backgroundColor: "white",
              height: "40px",
              marginRight: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                paddingLeft: "10px",
              },
              "& .MuiInputBase-input": {
                height: "1.5rem",
                padding: "10px",
              },
            }}
          />
          <select
            className="hospital-select3"
            value={selectedHospital}
            onChange={handleHospitalChange}
          >
            <option value="">Select a location</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
          <button className="reset-button3" onClick={handleReset}>
            Reset
          </button>
        </div>

        <table className="patient-table3">
          <thead>
            <tr>
              <th>NAME</th>
              <th>AGE</th>
              <th>GENDER</th>
              <th>APPOINTMENT</th>
              <th>AGE GROUP</th>
              <th>STATUS</th>
              <th>HOSPITAL</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient, index) => (
              <tr key={index}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.appointment}</td>
                <td>{patient.ageGroup}</td>
                <td>{patient.status}</td>
                <td>{patient.hospital}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientTable;