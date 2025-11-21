import React, { useState, useEffect } from "react";
import "../styles/PatientDetailCard.css";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';

const PatientDetailCard = ({ patient, onClose, onRemove }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Debug log when patient data changes
  useEffect(() => {
    console.log('Patient data:', patient);
    console.log('User ID:', patient?.user?.id);
  }, [patient]);

  const getLocationDisplay = () => {
    if (patient.hospital?.name) {
      return patient.hospital.name;
    }
    if (patient.clinic?.name) {
      return patient.clinic.name;
    }
    return "N/A";
  };

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

  const handleRemovePatient = async () => {
    if (!window.confirm("Are you sure you want to remove this patient and all their appointments? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      // Delete appointments first
      console.log("Deleting appointments for patient:", patient.id);
      const appointmentResponse = await axios.delete(`http://localhost:8080/api/appointments/${patient.user?.id}`);
      console.log("Appointment deletion response:", appointmentResponse);

      if (appointmentResponse.data.message === "Appointments deleted successfully") {
        // Then delete the user
        console.log("Deleting user:", patient.user?.id);
        await axios.delete(`http://localhost:8080/auth/users/${patient.user?.id}`);
        
        onRemove(patient.user?.id);
        onClose();
      }
    } catch (error) {
      console.error("Delete operation failed:", error);
      
      let errorMessage;
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Failed to remove patient';
      }
      
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="patient-detail-card3">
      <div className="close-btn3" onClick={onClose}>
        <CloseIcon />
      </div>
      <div className="card-content3">
        <div className="psection3">
          <div className="human-icon3"> <AccountCircleIcon sx={{ fontSize: 40 }} /> </div>
          <div className="psection-left3">
            <p className="que3">Patient Name:</p>
            <p className="ans3">{patient.user?.fullName || patient.user?.username || "Unknown"}</p>
            <p className="que3">Email:</p>
            <p className="ans3">{patient.user?.email || "N/A"}</p>
          </div>
          <div className="psection-right3">
            <p className="que3">Age:</p>
            <p className="ans3">{patient.user?.age || patient.user?.phone || "N/A"}</p>
            <p className="que3">Status:</p>
            <p className="ans3">{patient.status || "N/A"}</p>
          </div>
        </div>
        <div className="dsection3">
          <div className="human-icon3"> <AccountCircleIcon sx={{ fontSize: 40 }} /> </div>
          <div className="dsection-left3">
            <p className="que3">Doctor Name:</p>
            <p className="ans3">{patient.doctor?.name || "No Doctor Assigned"}</p>
            <p className="que3">Location:</p>
            <p className="ans3">{getLocationDisplay()}</p>
          </div>
          <div className="dsection-right3">
            <p className="que3">Schedule:</p>
            <p className="ans3">{formatDateTime(patient.appointmentDate, patient.appointmentTime)}</p>
          </div>
        </div>

        {error && (
          <div className="error-message" style={{ 
            color: 'red', 
            marginTop: '10px', 
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        {/* <button 
          className="remove-btn3" 
          onClick={handleRemovePatient}
          disabled={isDeleting}
          style={{ 
            opacity: isDeleting ? 0.7 : 1,
            cursor: isDeleting ? 'not-allowed' : 'pointer'
          }}
        >
          {isDeleting ? "Removing..." : "Remove Patient"}
        </button> */}
      </div>
    </div>
  );
};

export default PatientDetailCard;
