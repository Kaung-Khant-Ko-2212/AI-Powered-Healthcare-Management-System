import React, { useState, useEffect } from "react"; 
import axios from "axios"; // Make sure to install axios
import "../styles/AdminPatientList.css";
import PatientDetailCard from "./PatientDetailCard";
import Sidebar from "./Sidebar";

const AdminPatientList = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filter, setFilter] = useState({
    location: "",
    doctor: "",
    clinic: "",
    date: "",
  });
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospitalsRes, clinicsRes, doctorsRes, appointmentsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/hospitals/all"),
          axios.get("http://localhost:8080/api/clinics/all"),
          axios.get("http://localhost:8080/api/doctors/all"),
          axios.get("http://localhost:8080/api/appointments/all")
        ]);

        console.log("Appointments Data:", appointmentsRes.data);
        setHospitals(hospitalsRes.data);
        setClinics(clinicsRes.data);
        setDoctors(doctorsRes.data);
        setPatients(appointmentsRes.data);
        setFilteredPatients(appointmentsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFilteredPatients([]);
        setPatients([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      console.log('Selected patient:', selectedPatient);
      console.log('Selected patient user ID:', selectedPatient?.user?.id);
    }
  }, [selectedPatient]);

  const formatDateTime = (date, time) => {
    if (!date) return "N/A";
    try {
      const dateObj = new Date(date);
      const formattedDate = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      return time ? `${formattedDate} - ${time}` : formattedDate;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "N/A";
    }
  };

  const getLocationDisplay = (appointment) => {
    const hospital = appointment.hospital?.name;
    const clinic = appointment.clinic?.name;
    
    if (hospital && clinic) {
      return `${hospital} / ${clinic}`;
    } else if (hospital) {
      return hospital;
    } else if (clinic) {
      return clinic;
    }
    return "N/A";
  };

  const handleSearch = () => {
    const filtered = patients.filter((patient) => {
      const matchesLocation = !filter.location || patient.hospital?.name === filter.location;
      const matchesDoctor = !filter.doctor || patient.doctor?.name === filter.doctor;
      const matchesClinic = !filter.clinic || patient.clinic?.name === filter.clinic;
      
      // Ensure `patient.appointment` is defined before using `split`
      const appointmentDate = patient.appointmentDate ? patient.appointmentDate : null;
      const matchesDate = !filter.date || (appointmentDate && new Date(appointmentDate).toDateString() === new Date(filter.date).toDateString());
  
      return matchesLocation && matchesDoctor && matchesClinic && matchesDate;
    });
    setFilteredPatients(filtered);
  };

  const handleRemovePatient = (userId) => {
    // Update both lists to remove the deleted patient
    setPatients(prevPatients => 
      prevPatients.filter(patient => patient.user.id !== userId)
    );
    setFilteredPatients(prevFiltered => 
      prevFiltered.filter(patient => patient.user.id !== userId)
    );
  };

  const handleReset = () => {
    setFilter({ location: "", doctor: "", clinic: "", date: "" });
    setFilteredPatients(patients);
  };

  const handleViewDetails = (patient) => {
    console.log('Clicked patient data:', patient);
    setSelectedPatient(patient);
  };

  const handleCloseDetailCard = () => {
    setSelectedPatient(null);
  };

  return (
    <div className="admin-patient-list3">
      <Sidebar />
      <div className="filter-container3">
        <select
          value={filter.location}
          onChange={(e) => setFilter({ ...filter, location: e.target.value })}
        >
          <option value="">Select Hospital</option>
          {hospitals.length > 0 ? (
            hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.name}>{hospital.name}</option>
            ))
          ) : (
            <option disabled>Loading...</option>
          )}
        </select>

        <select
          value={filter.clinic}
          onChange={(e) => setFilter({ ...filter, clinic: e.target.value })}
        >
          <option value="">Select Clinic</option>
          {clinics.length > 0 ? (
            clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.name}>{clinic.name}</option>
            ))
          ) : (
            <option disabled>Loading...</option>
          )}
        </select>

        <select
          value={filter.doctor}
          onChange={(e) => setFilter({ ...filter, doctor: e.target.value })}
        >
          <option value="">Select Doctor</option>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
            ))
          ) : (
            <option disabled>Loading...</option>
          )}
        </select>

        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />

        <div className="search-btn3" onClick={handleSearch}>
          Search
        </div>
        <div className="reset-btn3" onClick={handleReset}>
          Reset
        </div>
      </div>

      <table className="patient-table3">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Location</th>
            <th>Schedule</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((appointment) => {
              const doctorName = appointment.doctor?.name || "No Doctor Assigned";
              const locationDisplay = getLocationDisplay(appointment);
              const patientName = appointment.user?.fullName || "Unknown";
              const schedule = formatDateTime(appointment.appointmentDate, appointment.appointmentTime);

              return (
                <tr key={appointment.id}>
                  <td>{patientName}</td>
                  <td>{doctorName}</td>
                  <td>{locationDisplay}</td>
                  <td>{schedule}</td>
                  <td>{appointment.status || "N/A"}</td>
                  <td>
                    <div className="details-btn3" onClick={() => handleViewDetails(appointment)}>
                      Details
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No matching data found</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedPatient && (
        <PatientDetailCard
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onRemove={handleRemovePatient}
        />
      )}
    </div>
  );
};

export default AdminPatientList;
