import React, { useState, useEffect } from 'react';
import AppointmentCard from './AppointmentCard';
import '../styles/AppointmentCalendar.css';

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(''); // Represents hospital or clinic ID
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [locations, setLocations] = useState([]); // To store unique hospitals and clinics

  // Function to format date to "YYYY-MM-DD"
  const formatDateToYYYYMMDD = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Function to get the next 5 dates including the selected date
  const getNextFiveDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(formatDateToYYYYMMDD(date));
    }
    return dates;
  };

  // Function to generate time slots dynamically
  const generateTimeSlots = (appointments) => {
    if (appointments.length === 0) return [];

    let minHour = 24, maxHour = 0;
    appointments.forEach(appt => {
      const hour = new Date(`2000-01-01T${appt.appointmentTime}`).getHours();
      if (hour < minHour) minHour = hour;
      if (hour > maxHour) maxHour = hour;
    });

    const slots = [];
    for (let hour = minHour; hour <= maxHour; hour++) {
      const amPm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      slots.push(`${displayHour}:00 ${amPm}`);
    }
    return slots;
  };

  // Fetch locations (hospitals and clinics) and appointments
  const fetchData = async () => {
    try {
      // Retrieve doctorId from localStorage
      const doctorId = localStorage.getItem("doctorId");

      if (!doctorId) {
        throw new Error("Doctor ID is missing. Please log in again.");
      }

      // Fetch doctor's hospitals and clinics
      const locationResponse = await fetch(`http://localhost:8080/api/doctors/${doctorId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
        },
      });
      if (!locationResponse.ok) {
        throw new Error(`HTTP error fetching doctor details! status: ${locationResponse.status}`);
      }
      const doctorData = await locationResponse.json();

      // Deduplicate hospitals by id
      const hospitalMap = new Map();
      (doctorData.hospitals || []).forEach(h => hospitalMap.set(h.id, { id: h.id, name: h.name }));
      const uniqueHospitals = Array.from(hospitalMap.values());

      // Deduplicate clinics by id
      const clinicMap = new Map();
      (doctorData.clinics || []).forEach(c => clinicMap.set(c.id, { id: c.id, name: c.name }));
      const uniqueClinics = Array.from(clinicMap.values());

      // Combine unique hospitals and clinics
      const combinedLocations = [...uniqueHospitals, ...uniqueClinics];
      setLocations(combinedLocations);

      // Fetch appointments
      const response = await fetch(`http://localhost:8080/api/appointments/doctor/${doctorId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error fetching appointments! status: ${response.status}`);
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        setAppointments(data); // Store all appointments for time slot generation
        if (selectedDate) {
          const formattedDates = getNextFiveDates(new Date(selectedDate));
          const filtered = formattedDates.reduce((acc, date) => {
            acc[date] = data.filter(appointment =>
              appointment.status === 'CONFIRMED' &&
              appointment.appointmentDate === date &&
              (selectedHospital ? (
                (appointment.hospital && String(appointment.hospital.id) === String(selectedHospital)) ||
                (appointment.clinic && String(appointment.clinic.id) === String(selectedHospital))
              ) : true)
            );
            return acc;
          }, {});
          setFilteredAppointments(filtered);
          setTimeSlots(generateTimeSlots(data));
        }
      } else {
        setAppointments([]);
        setFilteredAppointments({});
        setTimeSlots([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAppointments([]);
      setFilteredAppointments({});
      setTimeSlots([]);
    }
  };

  // Fetch data on mount and when search is triggered
  useEffect(() => {
    fetchData(); // Initial fetch to load locations
  }, []);

  return (
    <div className="calendar-container3">
      <div className="calendar-header3">
        <h2 className="calendar-header-h23">Appointment</h2>
        <p className="calendar-header-p3">Track your patient medical appointments</p>
      </div> 
      <div className='calendar-body3'>
        <div className="filter-group3">
          <input
            type="date"
            className="date-picker3"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <select
            className="hospital-selector3"
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
          >
            <option value="">Select a location</option>
            {locations.map((location, index) => (
              <option key={index} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          <button className="search-btn3" onClick={fetchData}>Search</button>
        </div>
        
        <div className="calendar3">
          <div className="calendar-grid3">
            <div className="calendar-row3">
              <div className="calendar-cell3 time-header3">Time</div>
              {selectedDate && getNextFiveDates(new Date(selectedDate)).map((date, index) => (
                <div key={index} className="calendar-cell3 day-header3">{date}</div>
              ))}
            </div>

            {timeSlots.map((slot, i) => {
              const slotHour = parseInt(slot) + (slot.includes("PM") && !slot.startsWith("12") ? 12 : 0);

              return (
                <div key={i} className="calendar-row3">
                  <div className="calendar-cell3 time-slot3">{slot}</div>
                  {selectedDate && getNextFiveDates(new Date(selectedDate)).map((date, index) => (
                    <div key={index} className="calendar-cell3">
                      {filteredAppointments[date]?.filter(appt => {
                        const appointmentHour = new Date(`2000-01-01T${appt.appointmentTime}`).getHours();
                        return appointmentHour === slotHour;
                      }).map((appointment, i) => (
                        <AppointmentCard key={i} appointment={appointment} />
                      ))}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;