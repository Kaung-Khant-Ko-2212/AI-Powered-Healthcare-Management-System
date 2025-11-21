import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './SpecialistsPage.css';
import Usernavbar from "./Usernavbar";
import axios from 'axios';
import SpecialistList from "./SpecialistList";

const SpecialistsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/hospitals/all')
      .then(response => setHospitals(response.data))
      .catch(error => console.error('Error fetching hospitals:', error));

    axios.get('http://localhost:8080/api/clinics/all')
      .then(response => setClinics(response.data))
      .catch(error => console.error('Error fetching clinics:', error));
  }, []);

  const handleSearch = () => {
    const params = {
      query: searchQuery.trim(),
      hospitalId: selectedHospital || '',
      clinicId: selectedClinic || ''
    };

    const url = `http://localhost:8080/api/doctors/search?query=${params.query}&hospitalId=${params.hospitalId}&clinicId=${params.clinicId}`;
    
    axios.get(url)
      .then(response => setSearchResults(response.data))
      .catch(error => {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      });
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedHospital("");
    setSelectedClinic("");
    
    axios.get("http://localhost:8080/api/doctors/all")
      .then(response => setSearchResults(response.data))
      .catch(error => console.error('Error fetching all doctors:', error));
  };

  return (
    <div className="App">
      <Usernavbar/>
      <div className="d5container_filter_bar" style={{ marginTop: "80px" }}>
        <div className="filters-container">
          <input 
            type="text" 
            placeholder="Search by doctor name" 
            className="d5filters-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <select 
            className="filters-dropdown"
            value={selectedHospital}
            onChange={(e) => {
              setSelectedHospital(e.target.value);
              setSelectedClinic("");
            }}
          >
            <option value="">Filter by Hospital</option>
            {hospitals.map(hospital => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
          <select 
            className="filters-dropdown"
            value={selectedClinic}
            onChange={(e) => {
              setSelectedClinic(e.target.value);
              setSelectedHospital("");
            }}
          >
            <option value="">Filter by Clinic</option>
            {clinics.map(clinic => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name}
              </option>
            ))}
          </select>
          <button className="search-button" onClick={handleSearch}>Search</button>
          <button className="search-button" onClick={handleReset}>Reset</button>
        </div>
      </div>
      
      <SpecialistList searchResults={searchResults} />
    </div>
  );
};

export default SpecialistsPage;
