import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Usernavbar from "./Usernavbar";

const MapComponent = () => {
    const mapContainerStyle = {
        width: "60%",
        height: "70vh",
        borderRadius: "10px",
    };

    const detailsContainerStyle = {
        width: "35%",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        textAlign: "left",
        overflowY: "auto",
        maxHeight: "70vh",
        border: "1px solid #ddd",
    };

    const containerStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        width: "90%",
        margin: "auto",
        marginTop: "20px",
    };

    const defaultCenter = { lat: 16.8409, lng: 96.1735 };
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [mapZoom, setMapZoom] = useState(12);
    const [hospitals, setHospitals] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [allPlaces, setAllPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        Promise.all([
            fetch("http://localhost:8080/api/hospitals/all").then(res => res.json()),
            fetch("http://localhost:8080/api/clinics/all").then(res => res.json())
        ])
        .then(([hospitalsData, clinicsData]) => {
            console.log("Raw Hospitals Data:", hospitalsData);
            const formattedHospitals = hospitalsData.map(h => {
                console.log("Hospital Item (Raw):", h);
                const mappedHospital = {
                    ...h,
                    type: "Hospital",
                    latitude: h.latitude || null,
                    longitude: h.longitude || null,
                    openHours: h.open_Hours || h.open_hours || h.openHours || "Not available",
                    website: h.website || "No website",
                    phone: h.phone || "Not available",
                    address: h.address || "Not available"
                };
                console.log("Hospital Item (Mapped):", mappedHospital);
                return mappedHospital;
            });
            const formattedClinics = clinicsData.map(c => {
                console.log("Clinic Item (Raw):", c);
                const mappedClinic = {
                    ...c,
                    type: "Clinic",
                    latitude: c.latitude || null,
                    longitude: c.longitude || null,
                    openHours: c.open_Hours || c.open_hours || c.openHours || "Not available", // Fixed 'h' to 'c'
                    website: c.website || "No website",  // Ensuring the website is picked correctly
                    phone: c.phone || "Not available",   // Ensuring the phone is picked correctly
                    address: c.address || "Not available" // Ensuring the address is picked correctly
                };
                console.log("Clinic Item (Mapped):", mappedClinic);
                return mappedClinic;
            });
            

            const combinedList = [...formattedHospitals, ...formattedClinics].filter(p => p.latitude && p.longitude);
            
            console.log("Combined List:", combinedList);
            setHospitals(formattedHospitals);
            setClinics(formattedClinics);
            setAllPlaces(combinedList);
            setFilteredPlaces(combinedList);
        })
        .catch(error => console.error("Error fetching data:", error));
    }, []);

    const handleSelectPlace = (event) => {
        const [type, id] = event.target.value.split("-");
        const selected = allPlaces.find((p) => p.id === Number(id) && p.type === type);
    
        if (selected) {
            setMapCenter({ lat: selected.latitude, lng: selected.longitude });
            setMapZoom(20);
            setSelectedPlace(selected);
            console.log("Selected Place:", selected);
        }
    };

    const showHospitals = () => {
        setFilteredPlaces(hospitals.filter(p => p.latitude && p.longitude));
        setActiveFilter("hospital");
    };

    const showClinics = () => {
        setFilteredPlaces(clinics.filter(p => p.latitude && p.longitude));
        setActiveFilter("clinic");
    };

    const showAll = () => {
        setFilteredPlaces(allPlaces);
        setActiveFilter("all");
    };

    return (
        <div>
            <Usernavbar />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "10px", marginTop: "100px" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button 
                        onClick={showAll} 
                        style={{ ...buttonStyle, backgroundColor: activeFilter === "all" ? "#007BFF" : "#556070" }}
                    >
                        Show All
                    </button>
                    <button 
                        onClick={showHospitals} 
                        style={{ ...buttonStyle, backgroundColor: activeFilter === "hospital" ? "#007BFF" : "#556070" }}
                    >
                        Search by Hospital
                    </button>
                    <button 
                        onClick={showClinics} 
                        style={{ ...buttonStyle, backgroundColor: activeFilter === "clinic" ? "#007BFF" : "#556070" }}
                    >
                        Search by Clinic
                    </button>
                </div>
                
                <select onChange={handleSelectPlace} style={dropdownStyle}>
                    <option value="">Select a Place</option>
                    {filteredPlaces.map((place) => (
                        <option key={`${place.type}-${place.id}`} value={`${place.type}-${place.id}`}>
                            {place.name} ({place.type})
                        </option>                
                    ))}
                </select>
            </div>

            <div style={containerStyle}>
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={mapZoom} center={mapCenter}>
                        {filteredPlaces.map((place) => (
                            <Marker key={`${place.type}-${place.id}`} position={{ lat: place.latitude, lng: place.longitude }} />
                        ))}
                    </GoogleMap>
                </LoadScript>

                <div style={detailsContainerStyle}>
                    {selectedPlace ? (
                        <>
                            <h2>{selectedPlace.name}</h2>
                            <p><strong>Type:</strong> {selectedPlace.type}</p>
                            <p><strong>Address:</strong> {selectedPlace.address}</p>
                            <p><strong>Open Hours:</strong> {selectedPlace.openHours}</p>
                            <p><strong>Website:</strong> {selectedPlace.website}</p>
                            <p><strong>Contact:</strong> {selectedPlace.phone}</p>
                        </>
                    ) : (
                        <p>Select a place to see details</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const buttonStyle = {
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    color: "white",
    transition: "background-color 0.3s",
};

const dropdownStyle = {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
};

export default MapComponent;