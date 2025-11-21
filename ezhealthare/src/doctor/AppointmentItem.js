import React from "react";
import "../styles/AppointmentItem.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const AppointmentItem = ({ appointment }) => {
  // Extract details from the appointment object
  const { user, appointmentDate, appointmentTime } = appointment;
  const userFullName = user ? user.fullName : "Unknown"; // Use fullName instead of username

  return (
    <div className="appointment-item3">
      <div className="gp13">
        <AccountCircleIcon />
        <span>{userFullName}</span>
      </div>
      <div className="gp23">
        <span>{appointmentDate}</span>
        <span>{appointmentTime.slice(0, 5)}</span> {/* Trim time to HH:MM */}
      </div>
    </div>
  );
};

export default AppointmentItem;