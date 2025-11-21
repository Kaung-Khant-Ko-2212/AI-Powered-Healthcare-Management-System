import React from 'react';
import '../styles/AppointmentCard.css';

const AppointmentCard = ({ appointment }) => {
  const { user, appointmentDate, appointmentTime } = appointment; // Destructure user and appointment details
  const userName = user ? user.username : "Unknown"; // Ensure user exists before accessing
  return (
    <div className="appointment-card3">
      {/* Assuming 'name' is now available on the appointment object */}
      <p className="appointment-name3">{userName}</p> {/* Use userName from the backend */}
      <p className="appointment-time3">{appointmentDate}</p>
      <p className="appointment-date3">{appointmentTime}</p> {/* If date is available */}
    </div>
  );
};

export default AppointmentCard;
