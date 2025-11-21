import React, { useState, useEffect } from 'react';
import SpecialistCard from './SpecialistCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Specialties from "./Specialties";

const SpecialistList = ({ searchResults }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Get `userId` from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.warn("No userId found. Redirecting to login.");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch specialties for the dropdown
  useEffect(() => {
    axios.get('http://localhost:8080/api/specialties/all')
      .then(response => setSpecialties(response.data))
      .catch(error => console.error('Error fetching specialties:', error));
  }, []);

  // Fetch doctors when selectedSpecialty or searchResults changes
  useEffect(() => {
    setLoading(true);

    if (searchResults) {
      setDoctors(searchResults);
      setLoading(false);
      return;
    }

    let url = "http://localhost:8080/api/doctors/all";

    if (selectedSpecialty === "fav") {
      url = `http://localhost:8080/api/favorites/all?userId=${userId}`;
    } else if (selectedSpecialty) {
      url = `http://localhost:8080/api/doctors/specialty/${selectedSpecialty}`;
    }

    axios.get(url)
      .then(response => {
        console.log('Doctors API Response:', response.data);
        setDoctors(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error('Error fetching doctor data:', error);
        setDoctors([]);
      })
      .finally(() => setLoading(false));
  }, [selectedSpecialty, userId, searchResults]);

  const handleCardClick = (doctor, event) => {
    if (event.target.className.includes("specialist-card-heart")) return;
    navigate(`/doctor/${doctor.id}`, { state: { doctor, userId } });
  };

  const getSpecialtyName = (specialtyId) => {
    if (specialtyId === "fav") return "Favorite Doctors";
    if (!specialtyId) return "All Specialists";
    
    const specialty = specialties.find(s => s.id.toString() === specialtyId.toString());
    return specialty ? specialty.name : "All Specialists";
  };

  return (
    <div>
      <Specialties onSelectSpecialty={setSelectedSpecialty} />
      
      <div className='d5_SLcontainer'>
        <div className='d5_SLheader'>
          <h2 className='d5_SLtitle'>
            {getSpecialtyName(selectedSpecialty)}
            <span className='d5_SLcount'> ({doctors.length})</span>
          </h2>
        </div>
        
        <div className='d5_SLcontrols'>
          <select 
            className='d5_SLdropdown' 
            value={selectedSpecialty || ""}
            onChange={(e) => setSelectedSpecialty(e.target.value || null)}
          >
            <option value="">All Doctors</option>
            <option value="fav">Favorite Doctors</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
          
          <button className="d5_SLbutton" onClick={() => navigate('/your-appointments')}>
            Your Appointments
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length > 0 ? (
        <div className="row">
          {doctors.map((doctor) => (
            <div 
              className="col-md-3 mb-4" 
              key={doctor.id} 
              onClick={(e) => handleCardClick(doctor, e)}
              style={{ cursor: 'pointer' }}
            >
              <SpecialistCard doctor={doctor} specialtyName={doctor.specialty?.name || 'Unknown Specialty'} userId={userId} />
            </div>
          ))}
        </div>
      ) : (
        <p>No doctors found.</p>
      )}
    </div>
  );
};

export default SpecialistList;
