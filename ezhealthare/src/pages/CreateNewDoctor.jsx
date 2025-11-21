import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateNewDoctor.css";
import Sidebar from "../admins/Sidebar";

const CreateNewDoctor = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    specialty: [],
    degree: "",
    experience: "",
    hospitals: [],
    clinics: [],
    password: "",
    schedules: {
      hospitals: {},
      clinics: {}
    },
    image: null // File object for new image
  });

  const [currentImageUrl, setCurrentImageUrl] = useState(null); // For existing image preview (optional, since this is for creating)
  const [imagePreview, setImagePreview] = useState(null); // For new image preview

  const BASE_URL = "http://localhost:8080"; // Backend base URL

  useEffect(() => {
    axios.get(`${BASE_URL}/api/specialties/all`)
      .then(response => {
        setSpecialties(response.data);
      })
      .catch(error => {
        console.error("Error fetching specialties:", error);
      });

    axios.get(`${BASE_URL}/api/hospitals/all`)
      .then(response => {
        setHospitals(response.data);
      })
      .catch(error => {
        console.error("Error fetching hospitals:", error);
      });

    axios.get(`${BASE_URL}/api/clinics/all`)
      .then(response => {
        setClinics(response.data);
      })
      .catch(error => {
        console.error("Error fetching clinics:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Phone number validation (max 12 digits, only numbers)
    if (name === "phoneNumber" && !/^\d{0,12}$/.test(value)) {
      return;
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const specialityInputChanger = (e) => {
    const selectedSpecialty = parseInt(e.target.value); // String -> Integer
    if (!isNaN(selectedSpecialty)) { 
      setFormData(prevState => ({
        ...prevState,
        specialty: selectedSpecialty // Assuming backend expects a single ID
      }));
    }
  };

  const handleHospitalChange = (e) => {
    const selectedHospitalId = parseInt(e.target.value);
    if (!isNaN(selectedHospitalId) && !formData.hospitals.includes(selectedHospitalId)) {
      setFormData(prevState => ({
        ...prevState,
        hospitals: [...prevState.hospitals, selectedHospitalId]
      }));
      initializeSchedule('hospitals', selectedHospitalId);
    }
  };

  const handleClinicChange = (e) => {
    const selectedClinicId = parseInt(e.target.value);
    if (!isNaN(selectedClinicId) && !formData.clinics.includes(selectedClinicId)) {
      setFormData(prevState => ({
        ...prevState,
        clinics: [...prevState.clinics, selectedClinicId]
      }));
      initializeSchedule('clinics', selectedClinicId);
    }
  };

  const initializeSchedule = (type, id) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    setFormData(prevState => ({
      ...prevState,
      schedules: {
        ...prevState.schedules,
        [type]: {
          ...prevState.schedules[type],
          [id]: days.map(day => ({
            day,
            startTime: '',
            endTime: ''
          }))
        }
      }
    }));
  };

  const handleScheduleChange = (type, id, day, field, value) => {
    setFormData(prevState => ({
      ...prevState,
      schedules: {
        ...prevState.schedules,
        [type]: {
          ...prevState.schedules[type],
          [id]: prevState.schedules[type][id].map(schedule =>
            schedule.day === day ? { ...schedule, [field]: value } : schedule
          )
        }
      }
    }));
  };

  const removeHospital = (hospitalId) => {
    setFormData(prevState => ({
      ...prevState,
      hospitals: prevState.hospitals.filter(id => id !== hospitalId),
      schedules: {
        ...prevState.schedules,
        hospitals: {
          ...prevState.schedules.hospitals,
          [hospitalId]: undefined
        }
      }
    }));
  };

  const removeClinic = (clinicId) => {
    setFormData(prevState => ({
      ...prevState,
      clinics: prevState.clinics.filter(id => id !== clinicId),
      schedules: {
        ...prevState.schedules,
        clinics: {
          ...prevState.schedules.clinics,
          [clinicId]: undefined
        }
      }
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return false;
    }

    if (formData.hospitals.length === 0 || formData.clinics.length === 0) {
      alert("Please select at least one hospital and one clinic.");
      return false;
    }

    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        alert("File is too large. Please select an image under 5MB.");
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert("Please select an image file.");
        return;
      }

      setFormData(prevState => ({
        ...prevState,
        image: file
      }));

      // Create preview URL for the new image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      
      // Append image if exists
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Prepare doctor data
      const doctorData = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        degree: formData.degree,
        experience: formData.experience,
        password: formData.password,
        specialty: { id: parseInt(formData.specialty) }, // Match backend expectation
        hospitals: formData.hospitals.map(hospital => ({
          id: parseInt(hospital),
          schedules: formData.schedules.hospitals[hospital]?.map(schedule => ({
            day: schedule.day,
            startTime: schedule.startTime,
            endTime: schedule.endTime
          })) || []
        })),
        clinics: formData.clinics.map(clinic => ({
          id: parseInt(clinic),
          schedules: formData.schedules.clinics[clinic]?.map(schedule => ({
            day: schedule.day,
            startTime: schedule.startTime,
            endTime: schedule.endTime
          })) || []
        })),
        createdAt: new Date().toISOString()
      };

      formDataToSend.append('doctorData', JSON.stringify(doctorData));

      const response = await axios.post(`${BASE_URL}/api/doctors/add`, 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        // Display alert with email and password
        alert(
          `Doctor created successfully!\nEmail: ${formData.email}\nPassword: ${formData.password}`
        );
        navigate("/schedule-admin");
      }
    } catch (error) {
      console.error("Error creating doctor:", error.response?.data || error);
      alert(
        "Failed to create doctor: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="create-new-dr-container2">
      <Sidebar className="sidebar2" />
      
      <div className="create-new-doctor2" style={{ marginLeft: "440px" }}>
        <h1>Create New Doctor</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Doctor Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter doctor's name" 
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number (Max 12 digits)</label>
            <input 
              type="text" 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number" 
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email" 
              required
            />
          </div>
          <div className="form-group">
            <label>Password (Min 6 characters)</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password" 
              required
            />
          </div>
          <div className="form-group">
            <label>Specialization</label>
            <select
              name="specialty"
              value={formData.specialty}
              onChange={specialityInputChanger}
              required
            >
              <option value="">Select Specialization</option>
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Degree</label>
            <input 
              type="text" 
              name="degree"
              value={formData.degree}
              onChange={handleInputChange}
              placeholder="Enter degree" 
              required
            />
          </div>
          <div className="form-group">
            <label>Experience</label>
            <input 
              type="text" 
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Enter experience" 
              required
            />
          </div>
          <div className="form-group">
            <label>Hospitals (Max 3)</label>
            <select
              name="hospital"
              onChange={handleHospitalChange}
              disabled={formData.hospitals.length >= 3}
            >
              <option value="">Select Hospital</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>

            <div className="selected-items">
              {formData.hospitals.map((hospitalId, index) => {
                const hospital = hospitals.find(h => h.id === hospitalId); // Find hospital by ID
                return (
                  <div key={index} className="selected-item">
                    {hospital ? hospital.name : `Hospital ID: ${hospitalId}`} {/* Show hospital name */}
                    <button type="button" onClick={() => removeHospital(hospitalId)}>×</button>
                  </div>
                );
              })}
            </div>
          </div>

          {formData.hospitals.map((hospitalId) => {
            const hospital = hospitals.find(h => h.id === hospitalId);
            return (
              <div key={hospitalId} className="schedule-container">
                <h4>{hospital?.name} Schedule</h4>
                <div className="schedule-grid">
                  {formData.schedules.hospitals[hospitalId]?.map((schedule) => (
                    <div key={schedule.day} className="schedule-row">
                      <span>{schedule.day}</span>
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleScheduleChange('hospitals', hospitalId, schedule.day, 'startTime', e.target.value)}
                        placeholder="Start Time"
                      />
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleScheduleChange('hospitals', hospitalId, schedule.day, 'endTime', e.target.value)}
                        placeholder="End Time"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="form-group">
            <label>Clinics (Max 3)</label>
            <select name="clinic" onChange={handleClinicChange} disabled={formData.clinics.length >= 3}>
              <option value="">Select Clinic</option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </option>
              ))}
            </select>

            <div className="selected-items">
              {formData.clinics.map((clinicId, index) => {
                const clinic = clinics.find(c => c.id === clinicId); // Find clinic by ID
                return (
                  <div key={index} className="selected-item">
                    {clinic ? clinic.name : `Clinic ID: ${clinicId}`} {/* Show clinic name */}
                    <button type="button" onClick={() => removeClinic(clinicId)}>×</button>
                  </div>
                );
              })}
            </div>
          </div>

          {formData.clinics.map((clinicId) => {
            const clinic = clinics.find(c => c.id === clinicId);
            return (
              <div key={clinicId} className="schedule-container">
                <h4>{clinic?.name} Schedule</h4>
                <div className="schedule-grid">
                  {formData.schedules.clinics[clinicId]?.map((schedule) => (
                    <div key={schedule.day} className="schedule-row">
                      <span>{schedule.day}</span>
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleScheduleChange('clinics', clinicId, schedule.day, 'startTime', e.target.value)}
                        placeholder="Start Time"
                      />
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleScheduleChange('clinics', clinicId, schedule.day, 'endTime', e.target.value)}
                        placeholder="End Time"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="form-group">
            <label>Profile Image</label>
            {currentImageUrl && (
              <div className="image-preview">
                <img src={currentImageUrl} alt="Current Profile" style={{ maxWidth: "100px", maxHeight: "100px", marginBottom: "10px" }} />
              </div>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {formData.image && (
              <div className="image-preview">
                <img src={URL.createObjectURL(formData.image)} alt="New Preview" style={{ maxWidth: "100px", maxHeight: "100px", marginTop: "10px" }} />
              </div>
            )}
          </div>

          <button type="submit">
            Create Doctor
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewDoctor;