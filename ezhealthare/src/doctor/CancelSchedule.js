import React, { useState } from 'react';   
import '../styles/CancelSchedule.css';
import Navbar from './Navbar';

const CancelSchedule = () => {
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e) => { 
    e.preventDefault();

    // Retrieve doctorId from localStorage
    const doctorId = localStorage.getItem('doctorId');

    if (!doctorId) {
      alert("Doctor ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/cancel-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optionally include the token for authentication if your backend requires it
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          doctorId: parseInt(doctorId), // Ensure it's a number if expected
          reason: reason,
          requestDate: new Date(date).toISOString(), // Convert to proper format
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Server error");
      }

      const data = await response.text();
      alert(data);
      setDate('');
      setReason('');
    } catch (error) {
      console.error("Error submitting request:", error);
      alert(`Failed to submit request: ${error.message}`);
    }
  };

  return (
    <div className='cancel-schedule3' >
      <Navbar />
      <div className="cancel-schedule-container3" >
        <h2 >Cancel Schedule</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group3">
            <label htmlFor="date">Select date to cancel:</label>
            <input
              className='cancel-schedule-input3'
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group3">
            <label htmlFor="reason">Reason for cancellation:</label>
            <select
              className='cancel-schedule-select3'
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">--Select Reason--</option>
              <option value="Medical Emergency">Medical Emergency</option>
              <option value="Personal Illness">Personal Illness</option>
              <option value="Unexpected Surgery">Unexpected Surgery</option>
              <option value="Family Emergency">Family Emergency</option>
              <option value="Scheduling Conflict">Scheduling Conflict</option>
              <option value="Travel/Out of Town">Travel/Out of Town</option>
              <option value="Severe Weather Conditions">Severe Weather Conditions</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" className="submit-button3">
            Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default CancelSchedule;