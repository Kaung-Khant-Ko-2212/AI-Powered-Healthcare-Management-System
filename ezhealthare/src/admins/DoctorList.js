import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DoctorList.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoctorDetailCard from "./DoctorDetailCard";
import Sidebar from "./Sidebar";
import DoctorEditForm from "./DoctorEditForm";

function DoctorList() {
  const [filters, setFilters] = useState({
    location: "",
    specialization: "",
    search: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [editDoctorId, setEditDoctorId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch doctors
        const doctorsResponse = await axios.get("http://localhost:8080/api/doctors/all");
        const doctorsData = Array.isArray(doctorsResponse.data) ? doctorsResponse.data : [];
        console.log("Doctors Data:", doctorsData);
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);

        // Fetch specialties
        const specialtiesResponse = await axios.get("http://localhost:8080/api/specialties/all");
        const specialtiesData = Array.isArray(specialtiesResponse.data) ? specialtiesResponse.data : [];
        setSpecializations(specialtiesData.map((spec) => spec.name).filter((name) => name));

        // Fetch all schedules and appointments for locations
        const allSchedules = [];
        const allAppointments = [];
        const profileLocations = [];

        for (const doctor of doctorsData) {
          // Profile locations
          profileLocations.push(
            ...(doctor.hospitals || []).map(h => ({ id: `h-${h.id}`, name: h.name, type: 'hospital' })),
            ...(doctor.clinics || []).map(c => ({ id: `c-${c.id}`, name: c.name, type: 'clinic' }))
          );

          // Schedules
          try {
            const doctorSchedulesResponse = await axios.get(`http://localhost:8080/api/doctor-schedule/doctor/${doctor.id}/locations`);
            const schedules = Array.isArray(doctorSchedulesResponse.data) ? doctorSchedulesResponse.data : [];
            console.log(`Schedules for Doctor ID ${doctor.id}:`, schedules);
            allSchedules.push(...schedules);
          } catch (scheduleError) {
            console.error(`Error fetching schedules for Doctor ID ${doctor.id}:`, scheduleError.response ? scheduleError.response.data : scheduleError.message);
          }

          // Appointments
          try {
            const appointmentsResponse = await axios.get(`http://localhost:8080/api/appointments/doctor/${doctor.id}`);
            const appointments = Array.isArray(appointmentsResponse.data) ? appointmentsResponse.data : [];
            console.log(`Appointments for Doctor ID ${doctor.id}:`, appointments);
            allAppointments.push(...appointments);
          } catch (appointmentError) {
            console.error(`Error fetching appointments for Doctor ID ${doctor.id}:`, appointmentError.response ? appointmentError.response.data : appointmentError.message);
          }
        }
        console.log("All Doctor Schedules:", allSchedules);
        setDoctorSchedules(allSchedules);

        // Extract locations from schedules
        const scheduleLocations = allSchedules
          .filter(s => s.hospital || s.clinic)
          .map(s => {
            if (s.hospital) return { id: `h-${s.hospital.id}`, name: s.hospital.name, type: 'hospital' };
            if (s.clinic) return { id: `c-${s.clinic.id}`, name: s.clinic.name, type: 'clinic' };
            return null;
          })
          .filter(loc => loc !== null);
        console.log("Schedule Locations:", scheduleLocations);

        // Extract locations from appointments
        const appointmentLocations = allAppointments
          .filter(a => a.hospital || a.clinic)
          .map(a => {
            if (a.hospital) return { id: `h-${a.hospital.id}`, name: a.hospital.name, type: 'hospital' };
            if (a.clinic) return { id: `c-${a.clinic.id}`, name: a.clinic.name, type: 'clinic' };
            return null;
          })
          .filter(loc => loc !== null);
        console.log("Appointment Locations:", appointmentLocations);

        // Combine and deduplicate all locations
        const allLocations = [...profileLocations, ...scheduleLocations, ...appointmentLocations];
        const locationMap = new Map();
        allLocations.forEach(location => {
          locationMap.set(location.id, location);
        });
        const uniqueLocations = Array.from(locationMap.values());
        setLocations(uniqueLocations);
        console.log("Unique Locations:", uniqueLocations);

      } catch (error) {
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
        setError("Failed to load data: " + (error.response ? error.response.statusText : "Network error"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      let retryCount = 0;
      const maxRetries = 3;

      const attemptDelete = async () => {
        try {
          const response = await axios.delete(`http://localhost:8080/api/doctors/${doctorId}`);
          if (response.status === 200) {
            setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor.id !== doctorId));
            setFilteredDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor.id !== doctorId));
            return true;
          } else {
            throw new Error("Unexpected response from server");
          }
        } catch (error) {
          console.error("Error deleting doctor (attempt " + (retryCount + 1) + "):", error.response ? error.response.data : error.message);
          const errorMessage = error.response?.data?.message || 
            "An internal server error occurred. Please try again later.";
          if (retryCount < maxRetries && error.response?.status === 500) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            return attemptDelete();
          } else {
            alert(`Failed to delete the doctor: ${errorMessage}`);
            setError(errorMessage);
            return false;
          }
        }
      };

      await attemptDelete();
    }
  };

  const handleEdit = (doctorId) => {
    console.log("Editing doctor with ID:", doctorId);
    setEditDoctorId(doctorId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    console.log("Filter changed:", { [name]: value });
  };

  const handleSearch = () => {
    const searchQuery = filters.search.trim().toLowerCase();
    console.log("Filtering with:", filters);

    setFilteredDoctors(
      doctors.filter((doctor) => {
        const matchesLocation =
          filters.location === "" ||
          doctorSchedules.some((schedule) =>
            schedule.doctor?.id === doctor.id &&
            ((schedule.hospital && `h-${schedule.hospital.id}` === filters.location) ||
             (schedule.clinic && `c-${schedule.clinic.id}` === filters.location))
          );

        const matchesSpecialization =
          filters.specialization === "" ||
          (doctor.specialty?.name?.toLowerCase().includes(filters.specialization.toLowerCase()));

        const matchesSearch = searchQuery === "" || doctor.name?.toLowerCase().includes(searchQuery);

        console.log("Doctor filter result:", {
          doctorId: doctor.id,
          name: doctor.name,
          matchesLocation,
          matchesSpecialization,
          matchesSearch,
          scheduleLocations: doctorSchedules
            .filter((s) => s.doctor?.id === doctor.id)
            .map((s) => `${s.hospital ? 'h-' + s.hospital.id : 'c-' + s.clinic.id}: ${s.hospital?.name || s.clinic?.name || 'No Location'}`),
        });

        return matchesLocation && matchesSpecialization && matchesSearch;
      })
    );
  };

  const handleReset = () => {
    setFilters({ location: "", specialization: "", search: "" });
    setFilteredDoctors(doctors);
    console.log("Filters reset");
  };

  const handleFormClose = () => {
    console.log("Closing edit form");
    setEditDoctorId(null);
  };

  const handleFormSubmit = (updatedDoctor) => {
    console.log("Form submitted with updated doctor:", updatedDoctor);
    setDoctors((prevDoctors) =>
      prevDoctors.map((doctor) =>
        doctor.id === updatedDoctor.id ? { ...doctor, ...updatedDoctor } : doctor
      )
    );
    setFilteredDoctors((prevDoctors) =>
      prevDoctors.map((doctor) =>
        doctor.id === updatedDoctor.id ? { ...doctor, ...updatedDoctor } : doctor
      )
    );
    setEditDoctorId(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Sidebar />
      <div className="doctor-list-container3">
        <div className="doctor-list-header3">
          <div className="filters3">
            <div className="filters13">
              <select
                className="filter-select3"
                name="location"
                value={filters.location}
                onChange={handleInputChange}
              >
                <option value="">Select Location</option>
                {locations.length > 0 ? (
                  locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.type})
                    </option>
                  ))
                ) : (
                  <option disabled>No locations available</option>
                )}
              </select>

              <select
                className="filter-select3"
                name="specialization"
                value={filters.specialization}
                onChange={handleInputChange}
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <div className="filters23">
              <input
                type="text"
                className="filter-search3"
                placeholder="Search by Doctor Name"
                name="search"
                value={filters.search}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="filter-buttons3">
            <button className="btn3 btn-search3" onClick={handleSearch}>Search</button>
            <button className="btn3 btn-reset3" onClick={handleReset}>Reset</button>
          </div>
        </div>

        <table className="doctor-list-table3">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredDoctors) && filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor, index) => (
                <tr key={index}>
                  <td>{doctor.name || "N/A"}</td>
                  <td>{doctor.phoneNumber || "N/A"}</td>
                  <td>{doctor.email || "N/A"}</td>
                  <td>{doctor.specialty?.name || "N/A"}</td>
                  <td className="actions3">
                    <div className="btn3 btn-edit3" onClick={() => handleEdit(doctor.id)}>
                      <EditIcon />
                    </div>
                    <div
                      className="btn3 btn-details3"
                      onClick={() => setSelectedDoctorId(doctor.id)}
                    >
                      <p className="text3">Details</p>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No doctors found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedDoctorId && (
          <DoctorDetailCard doctorId={selectedDoctorId} onClose={() => setSelectedDoctorId(null)} />
        )}

        {editDoctorId && (
          <DoctorEditForm
            doctorId={editDoctorId}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default DoctorList;