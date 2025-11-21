import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DoctorEditForm.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const DoctorEditForm = ({ doctorId, onClose, onSubmit }) => {
  const [doctor, setDoctor] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    specialization: "",
    degree: "",
    experience: "",
    hospitals: [],
    clinics: [],
    image: null, // File object for new image
  });
  const [currentImageUrl, setCurrentImageUrl] = useState(null); // For existing image preview
  const [schedules, setSchedules] = useState({});
  const [newHospitalSchedules, setNewHospitalSchedules] = useState([]);
  const [newClinicSchedules, setNewClinicSchedules] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [showHospitalSchedules, setShowHospitalSchedules] = useState(false);
  const [showClinicSchedules, setShowClinicSchedules] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const BASE_URL = "http://localhost:8080"; // Backend base URL

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/doctors/${doctorId}`, {
          timeout: 5000,
        });
        console.log("Doctor Response:", response.data);
        const doctorData = response.data;
        setDoctor({
          name: doctorData.name || "",
          phoneNumber: doctorData.phoneNumber || "",
          email: doctorData.email || "",
          specialization: doctorData.specialty?.name || "",
          degree: doctorData.degree || "",
          experience: extractNumericExperience(doctorData.experience) || "",
          hospitals: doctorData.hospitals?.map(h => h.id) || [],
          clinics: doctorData.clinics?.map(c => c.id) || [],
          image: null,
        });
        if (doctorData.image) {
          setCurrentImageUrl(`${BASE_URL}/uploads/doctors/${doctorData.image}`);
        }

        const scheduleResponse = await axios.get(`${BASE_URL}/api/doctor-schedule/doctor/${doctorId}/locations`, {
          timeout: 5000,
        });
        console.log("Schedule Response:", scheduleResponse.data);
        const scheduleMap = {};
        scheduleResponse.data.forEach((loc) => {
          const locationId = loc.hospital?.id || loc.clinic?.id;
          const isHospital = !!loc.hospital;
          if (locationId && loc.dayOfWeek) {
            const key = `${locationId}-${loc.dayOfWeek}`;
            scheduleMap[key] = {
              id: loc.id,
              startTime: loc.startTime || "00:00:00",
              endTime: loc.endTime || "00:00:00",
              isHospital: isHospital,
            };
          } else {
            console.warn("Skipping schedule due to missing locationId or dayOfWeek:", loc);
          }
        });
        console.log("Loaded Schedules (scheduleMap):", scheduleMap);
        setSchedules(scheduleMap);

        const [specResponse, hospResponse, clinicResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/specialties/all`, { timeout: 5000 }),
          axios.get(`${BASE_URL}/api/hospitals/all`, { timeout: 5000 }),
          axios.get(`${BASE_URL}/api/clinics/all`, { timeout: 5000 }),
        ]);

        setSpecializations(Array.isArray(specResponse.data) ? specResponse.data.map(item => ({
          id: item.id || item.id,
          name: item.name || "Unnamed Specialty"
        })) : []);
        setHospitals(Array.isArray(hospResponse.data) ? hospResponse.data.map(item => ({
          id: item.id || item.id,
          name: item.name || "Unnamed Hospital"
        })) : []);
        setClinics(Array.isArray(clinicResponse.data) ? clinicResponse.data.map(item => ({
          id: item.id || item.id,
          name: item.name || "Unnamed Clinic"
        })) : []);
      } catch (error) {
        console.error("Full Error Details fetching doctor details:", error);
        if (retryCount < maxRetries) {
          setRetryCount(retryCount + 1);
          setTimeout(fetchDoctor, 1000 * retryCount);
          return;
        }
        setErrors({ 
          fetch: "Failed to load doctor or related data: " + 
                 (error.response?.data?.message || error.response?.statusText || "Network error")
        });
        setSpecializations([]);
        setHospitals([]);
        setClinics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId, retryCount]);

  const extractNumericExperience = (experience) => {
    if (!experience) return "";
    const match = experience.match(/^\d+/);
    return match ? match[0] : "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setDoctor({ ...doctor, [name]: files[0] });
    } else if (name === "experience") {
      const numericValue = value.replace(/\D/g, "");
      setDoctor({ ...doctor, [name]: numericValue });
    } else {
      setDoctor({ ...doctor, [name]: value });
    }
  };

  const handleDeleteSchedule = async (key) => {
    const schedule = schedules[key];
    if (!schedule || !schedule.id) {
      console.error("No schedule ID found for key:", key);
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/api/doctor-schedule/${schedule.id}`);
      setSchedules((prev) => {
        const newSchedules = { ...prev };
        delete newSchedules[key];
        console.log("Deleted schedule key:", key, "Updated schedules:", newSchedules);
        return newSchedules;
      });
    } catch (error) {
      console.error("Error deleting schedule:", error);
      setErrors(prev => ({
        ...prev,
        delete: `Failed to delete schedule: ${error.response?.data?.message || error.response?.statusText || "Network error"}`
      }));
    }
  };

  const handleNewScheduleChange = (type, index, field, value) => {
    const setScheduleFunc = type === "hospitals" ? setNewHospitalSchedules : setNewClinicSchedules;
    setScheduleFunc((prev) => {
      const updatedSchedules = [...prev];
      updatedSchedules[index] = { ...updatedSchedules[index], [field]: field === "locationId" ? parseInt(value, 10) : value };
      console.log(`Updated new ${type} schedule at index ${index}:`, updatedSchedules[index]);
      return updatedSchedules;
    });
  };

  const addNewSchedule = (type) => {
    const currentCount = type === "hospitals" 
      ? doctor.hospitals.length + newHospitalSchedules.length 
      : doctor.clinics.length + newClinicSchedules.length;
    if (currentCount >= 3) {
      setErrors(prev => ({
        ...prev,
        [type]: `Maximum of 3 ${type} allowed. Current count: ${currentCount}`
      }));
      return;
    }
    const availableLocations = type === "hospitals" ? hospitals : clinics;
    if (availableLocations.length === 0) {
      setErrors(prev => ({
        ...prev,
        [type]: `No ${type} available to add a schedule`
      }));
      console.warn(`No ${type} available to add a schedule.`);
      return;
    }
    const setScheduleFunc = type === "hospitals" ? setNewHospitalSchedules : setNewClinicSchedules;
    const newSchedule = { 
      locationId: availableLocations[0].id, 
      dayOfWeek: "MONDAY", 
      startTime: "09:00:00", 
      endTime: "17:00:00",   
      createdAt: new Date().toISOString(), 
    };
    setScheduleFunc((prev) => {
      const updatedSchedules = [...prev, newSchedule];
      console.log(`Added new ${type} schedule:`, newSchedule, "Updated list:", updatedSchedules);
      return updatedSchedules;
    });
    setDoctor((prev) => ({
      ...prev,
      [type]: prev[type].includes(availableLocations[0].id) ? prev[type] : [...prev[type], availableLocations[0].id],
    }));
    setErrors(prev => {
      const { [type]: removed, ...rest } = prev;
      return rest;
    });
  };

  const removeNewSchedule = (type, index) => {
    const setScheduleFunc = type === "hospitals" ? setNewHospitalSchedules : setNewClinicSchedules;
    setScheduleFunc((prev) => {
      const updatedSchedules = prev.filter((_, i) => i !== index);
      console.log(`Removed new ${type} schedule at index ${index}, Updated list:`, updatedSchedules);
      return updatedSchedules;
    });
    setErrors(prev => {
      const { [type]: removed, ...rest } = prev;
      return rest;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!doctor.name.trim()) newErrors.name = "Doctor name is required";
    if (!/^\d{10,12}$/.test(doctor.phoneNumber)) newErrors.phoneNumber = "Phone number must be 10-12 digits";
    if (!doctor.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doctor.email)) newErrors.email = "Valid email is required";
    if (doctor.hospitals.length > 3) newErrors.hospitals = "Maximum of 3 hospitals allowed";
    if (doctor.clinics.length > 3) newErrors.clinics = "Maximum of 3 clinics allowed";
    if (doctor.experience && !/^\d+$/.test(doctor.experience)) newErrors.experience = "Experience must be a number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const doctorFormData = new FormData();
    doctorFormData.append("name", doctor.name);
    doctorFormData.append("phoneNumber", doctor.phoneNumber);
    doctorFormData.append("email", doctor.email);
    doctorFormData.append("specialization", doctor.specialization);
    doctorFormData.append("degree", doctor.degree || "");
    doctorFormData.append("experience", doctor.experience || "");
    doctor.hospitals.forEach((hospitalId) => doctorFormData.append("hospitals", hospitalId));
    doctor.clinics.forEach((clinicId) => doctorFormData.append("clinics", clinicId));
    if (doctor.image) doctorFormData.append("image", doctor.image);

    const existingSchedules = Object.keys(schedules).map((key) => {
      const [locationId, dayOfWeek] = key.split("-");
      const schedule = schedules[key];
      return {
        id: schedule.id,
        locationId: parseInt(locationId, 10),
        dayOfWeek: dayOfWeek.toUpperCase(),
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        locationType: schedule.isHospital ? "hospital" : "clinic",
      };
    });

    const allNewSchedules = [
      ...newHospitalSchedules.map((schedule) => ({
        locationId: schedule.locationId,
        dayOfWeek: schedule.dayOfWeek.toUpperCase(),
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        locationType: "hospital",
        createdAt: schedule.createdAt || new Date().toISOString(),
      })),
      ...newClinicSchedules.map((schedule) => ({
        locationId: schedule.locationId,
        dayOfWeek: schedule.dayOfWeek.toUpperCase(),
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        locationType: "clinic",
        createdAt: schedule.createdAt || new Date().toISOString(),
      })),
    ];

    const combinedSchedules = [...existingSchedules, ...allNewSchedules];
    console.log("Submitting combined schedules:", combinedSchedules);

    try {
      const doctorResponse = await axios.put(
        `${BASE_URL}/api/doctors/${doctorId}`,
        doctorFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Doctor Update Response:", doctorResponse.data);

      if (combinedSchedules.length > 0) {
        try {
          const scheduleResponse = await axios.put(
            `${BASE_URL}/api/doctor-schedule/${doctorId}`,
            { schedules: combinedSchedules },
            { headers: { "Content-Type": "application/json" } }
          );
          console.log("Schedule Update Response:", scheduleResponse.data);

          // After successful submission, refresh schedules to reflect updates
          const refreshedScheduleResponse = await axios.get(`${BASE_URL}/api/doctor-schedule/doctor/${doctorId}/locations`, {
            timeout: 5000,
          });
          const scheduleMap = {};
          refreshedScheduleResponse.data.forEach((loc) => {
            const locationId = loc.hospital?.id || loc.clinic?.id;
            const isHospital = !!loc.hospital;
            if (locationId && loc.dayOfWeek) {
              const key = `${locationId}-${loc.dayOfWeek}`;
              scheduleMap[key] = {
                id: loc.id,
                startTime: loc.startTime || "00:00:00",
                endTime: loc.endTime || "00:00:00",
                isHospital: isHospital,
              };
            }
          });
          setSchedules(scheduleMap);
          setNewHospitalSchedules([]);
          setNewClinicSchedules([]);
        } catch (scheduleError) {
          console.error("Error updating schedules:", scheduleError);
          throw new Error(
            `Failed to update schedules: ${scheduleError.response?.data?.message || scheduleError.response?.statusText || "Network error"}`
          );
        }
      }

      onSubmit(doctorResponse.data);
      onClose();
    } catch (error) {
      console.error("Error submitting:", error);
      setErrors({
        submit:
          "Failed to update: " +
          (error.message || error.response?.data?.message || error.response?.statusText || "Network error"),
      });
      alert(
        `Submission failed: ${error.message || "Please check the server logs for details."}`
      );
    }
  };

  const renderSchedules = (type, newSchedules, setNewSchedules, toggleShow, show) => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const locations = type === "hospitals" ? hospitals : clinics;
    const filteredSchedules = Object.keys(schedules)
      .filter(key => {
        const [locationId] = key.split("-");
        const loc = locations.find(l => l.id === parseInt(locationId, 10));
        const isHospitalSchedule = schedules[key].isHospital;
        const matchesType = type === "hospitals" ? isHospitalSchedule : !isHospitalSchedule;
        console.log(`Filtering key ${key}: loc=${loc?.name}, isHospital=${isHospitalSchedule}, matchesType=${matchesType}`);
        return loc && matchesType;
      })
      .reduce((acc, key) => {
        acc[key] = schedules[key];
        return acc;
      }, {});
    console.log(`Rendering ${type} schedules - Filtered Existing:`, filteredSchedules, "New:", newSchedules);

    return (
      <div className="schedule-section3">
        <button type="button" onClick={toggleShow} className="toggle-schedule-btn">
          {show ? "Hide Existing Schedules" : "Show Existing Schedules"}
        </button>
        <button
          type="button"
          onClick={() => addNewSchedule(type)}
          className="add-schedule-btn"
          disabled={
            (type === "hospitals" && doctor.hospitals.length + newHospitalSchedules.length >= 3) ||
            (type === "clinics" && doctor.clinics.length + newClinicSchedules.length >= 3)
          }
        >
          Add New Schedule
        </button>
        {show && (
          <div>
            {Object.keys(filteredSchedules).length > 0 ? (
              Object.keys(filteredSchedules).map((key) => {
                const [locationId, dayOfWeek] = key.split("-");
                const location = locations.find(loc => loc.id === parseInt(locationId, 10));
                const schedule = filteredSchedules[key];
                return (
                  <div key={key} className="schedule-form3">
                    <h4>{location?.name || "Unknown Location"} - {dayOfWeek}</h4>
                    <div className="schedule-row3">
                      <input type="time" step="1" value={schedule.startTime || ""} disabled />
                      <span>-</span>
                      <input type="time" step="1" value={schedule.endTime || ""} disabled />
                      <button type="button" className="remove-btn3" onClick={() => handleDeleteSchedule(key)}>
                        ×
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No existing schedules for {type}.</p>
            )}
          </div>
        )}
        {newSchedules.map((schedule, index) => (
          <div key={index} className="schedule-form3">
            <h4>New Schedule {index + 1}</h4>
            <div className="schedule-row3">
              <select
                value={schedule.locationId || ""}
                onChange={(e) => handleNewScheduleChange(type, index, "locationId", e.target.value)}
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
              <select
                value={schedule.dayOfWeek || ""}
                onChange={(e) => handleNewScheduleChange(type, index, "dayOfWeek", e.target.value)}
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <input
                type="time"
                step="1"
                value={schedule.startTime || ""}
                onChange={(e) => handleNewScheduleChange(type, index, "startTime", e.target.value)}
              />
              <span>-</span>
              <input
                type="time"
                step="1"
                value={schedule.endTime || ""}
                onChange={(e) => handleNewScheduleChange(type, index, "endTime", e.target.value)}
              />
              <button type="button" className="remove-btn3" onClick={() => removeNewSchedule(type, index)}>
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="doctor-edit-form-overlay3">
      <div className="doctor-edit-form3">
        <div className="close-btn3" onClick={onClose}>✖</div>
        <div className="scrollable-form3">
          <h2>Edit Doctor Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group3">
              <label>Doctor Name</label>
              <input type="text" name="name" value={doctor.name} onChange={handleChange} />
              {errors.name && <span className="error3">{errors.name}</span>}
            </div>
            <div className="form-group3">
              <label>Phone Number (10-12 digits)</label>
              <input type="tel" name="phoneNumber" value={doctor.phoneNumber} onChange={handleChange} />
              {errors.phoneNumber && <span className="error3">{errors.phoneNumber}</span>}
            </div>
            <div className="form-group3">
              <label>Email</label>
              <input type="email" name="email" value={doctor.email} onChange={handleChange} />
              {errors.email && <span className="error3">{errors.email}</span>}
            </div>
            <div className="form-group3">
              <label>Specialization</label>
              <select name="specialization" value={doctor.specialization} onChange={handleChange}>
                <option value="">Select Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec.id} value={spec.name}>{spec.name}</option>
                ))}
              </select>
              {specializations.length === 0 && <span className="error3">No specializations available</span>}
            </div>
            <div className="form-group3">
              <label>Degree</label>
              <input type="text" name="degree" value={doctor.degree} onChange={handleChange} />
            </div>
            <div className="form-group3">
              <label>Experience (years)</label>
              <input type="number" name="experience" value={doctor.experience} onChange={handleChange} min="0" />
              {errors.experience && <span className="error3">{errors.experience}</span>}
            </div>
            <div className="form-group3">
              <label>Hospitals</label>
              {renderSchedules("hospitals", newHospitalSchedules, setNewHospitalSchedules, () => setShowHospitalSchedules(prev => !prev), showHospitalSchedules)}
              {errors.hospitals && <span className="error3">{errors.hospitals}</span>}
              {hospitals.length === 0 && <span className="error3">No hospitals available</span>}
            </div>
            <div className="form-group3">
              <label>Clinics</label>
              {renderSchedules("clinics", newClinicSchedules, setNewClinicSchedules, () => setShowClinicSchedules(prev => !prev), showClinicSchedules)}
              {errors.clinics && <span className="error3">{errors.clinics}</span>}
              {clinics.length === 0 && <span className="error3">No clinics available</span>}
            </div>
            <div className="form-group3">
              <label>Profile Image</label>
              <input type="file" name="image" accept="image/*" onChange={handleChange} />
            </div>
            {errors.fetch && <span className="error3">{errors.fetch}</span>}
            {errors.submit && <span className="error3">{errors.submit}</span>}
            {errors.delete && <span className="error3">{errors.delete}</span>}
            <button type="submit" className="submit-btn3">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorEditForm;