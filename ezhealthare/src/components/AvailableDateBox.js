import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./AvailableDateBox.css";

const AvailableDateBox = ({ doctorId, locationId, locationType, userId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [dateBookingCounts, setDateBookingCounts] = useState({});
  const [lockedDates, setLockedDates] = useState([]);

  // Fetch locked dates when the component mounts or doctorId changes
  useEffect(() => {
    const fetchLockedDates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/cancel-schedule/approved-dates/${doctorId}`
        );
        setLockedDates(response.data.map(dateStr => new Date(dateStr)));
      } catch (error) {
        console.error("Error fetching locked dates:", error);
      }
    };

    if (doctorId) {
      fetchLockedDates();
    }
  }, [doctorId]);

  // Fetch available dates when the component mounts or doctorId, locationId, or locationType changes
  useEffect(() => {
    if (!doctorId || !locationId || !locationType) return;
    fetchAvailableDates();
  }, [doctorId, locationId, locationType]);

  const fetchAvailableDates = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/doctor-schedule/${doctorId}/${locationId}/available-dates`,
        { params: { locationType } }
      );
      const dates = response.data.map(dateStr => new Date(dateStr));
      setAvailableDates(dates);

      // Fetch booking counts for each available date
      for (const date of dates) {
        const formattedDate = formatDate(date);
        const bookingsResponse = await axios.get(
          `http://localhost:8080/api/appointments/time-slot-bookings`,
          {
            params: {
              doctorId,
              locationId,
              date: formattedDate,
            },
          }
        );

        // Normalize time format in bookingsResponse.data
        const normalizedBookings = {};
        for (const [time, count] of Object.entries(bookingsResponse.data)) {
          const normalizedTime = time.substring(0, 5); // Converts "09:00:00" to "09:00"
          normalizedBookings[normalizedTime] = count;
        }

        setDateBookingCounts(prev => ({
          ...prev,
          [formattedDate]: normalizedBookings,
        }));
      }
    } catch (error) {
      console.error("Error fetching available dates:", error);
      setAvailableDates([]);
    }
  };

  // Fetch available time slots when the selected date changes
  useEffect(() => {
    if (!selectedDate || !doctorId || !locationId || !locationType) return;
    fetchAvailableTimeSlots();
  }, [selectedDate, doctorId, locationId, locationType]);

  // Reset selected time and available times when location changes
  useEffect(() => {
    setSelectedTime("");
    setAvailableTimes([]);
  }, [locationId]);

  const fetchAvailableTimeSlots = async () => {
    try {
      const formattedDate = formatDate(selectedDate);
      const response = await axios.get(
        `http://localhost:8080/api/doctor-schedule/${doctorId}/${locationId}/available-times`,
        {
          params: {
            locationType,
            date: formattedDate,
          },
        }
      );

      // Normalize time format (remove seconds)
      const normalizedTimes = response.data.map(time => time.substring(0, 5)); // Converts "09:00:00" to "09:00"
      setAvailableTimes(normalizedTimes.sort());
    } catch (error) {
      console.error("Error fetching available time slots:", error);
      setAvailableTimes([]);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !userId) return;
    setIsBooking(true);
    setError(null);

    try {
      const formattedDate = formatDate(selectedDate);
      const formattedTime = selectedTime.length === 5 ? `${selectedTime}:00` : selectedTime;

      const appointmentData = {
        doctorId: parseInt(doctorId),
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
      };

      if (locationType === "hospital") {
        appointmentData.hospitalId = parseInt(locationId);
      } else {
        appointmentData.clinicId = parseInt(locationId);
      }

      const response = await axios.post(
        `http://localhost:8080/api/appointments/book?userId=${userId}`,
        appointmentData
      );

      if (response.data) {
        alert("Appointment booked successfully!");
        setSelectedTime(null);
        fetchAvailableTimeSlots();
      }
    } catch (error) {
      console.error("Booking error:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to book appointment. Please try again.";
      setError(errorMessage);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsBooking(false);
    }
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Yangon",
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isDateAvailable = ({ date }) => {
    // Check if it's today
    if (isToday(date)) {
      return false;
    }

    // Check if the date is locked
    if (
      lockedDates.some(
        (lockedDate) =>
          date.getFullYear() === lockedDate.getFullYear() &&
          date.getMonth() === lockedDate.getMonth() &&
          date.getDate() === lockedDate.getDate()
      )
    ) {
      return false;
    }

    // Check if the date is in the available dates
    return availableDates.some(
      (availableDate) =>
        date.getFullYear() === availableDate.getFullYear() &&
        date.getMonth() === availableDate.getMonth() &&
        date.getDate() === availableDate.getDate()
    );
  };

  const getDateClassName = ({ date }) => {
    // Check if the date is locked
    if (
      lockedDates.some(
        (lockedDate) =>
          date.getFullYear() === lockedDate.getFullYear() &&
          date.getMonth() === lockedDate.getMonth() &&
          date.getDate() === lockedDate.getDate()
      )
    ) {
      return "react-calendar__tile--locked";
    }

    // If it's today, return a special class
    if (isToday(date)) {
      return "unavailable-date";
    }

    if (!isDateAvailable({ date })) {
      return "unavailable-date";
    }

    const formattedDate = formatDate(date);
    const bookings = dateBookingCounts[formattedDate];

    // Check if any time slot is fully booked (5 or more bookings)
    const hasFullyBookedSlots = bookings && Object.values(bookings).some(count => count >= 5);
    const hasPartiallyBookedSlots = bookings && Object.values(bookings).some(count => count > 0 && count < 5);

    if (hasFullyBookedSlots) return "fully-booked-date";
    if (hasPartiallyBookedSlots) return "partially-booked-date";
    return "available-date";
  };

  return (
    <>
      {showError && error && (
        <div className="error-message-container">
          <div className="error-message-content">{error}</div>
          <button
            className="error-close-button"
            onClick={() => setShowError(false)}
          >
            ×
          </button>
        </div>
      )}
      <div className="appointment-booking-container">
        <div className="calendar-section">
          <h2>Select a Date</h2>
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-color available"></div>
              <span>Available</span>
            </div>
            {/* <div className="legend-item">
              <div className="legend-color partial"></div>
              <span>Partially Booked</span>
            </div>
            <div className="legend-item">
              <div className="legend-color full"></div>
              <span>Fully Booked</span>
            </div> */}
            <div className="legend-item">
              <div className="legend-color unavailable"></div>
              <span>Unavailable</span>
            </div>
          </div>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={new Date()}
            tileDisabled={({ date }) => !isDateAvailable({ date })}
            tileClassName={getDateClassName}
          />
        </div>

        <div className="time-slots-section">
          <h3>Available Time Slots for {formatDisplayDate(selectedDate)}</h3>
          <div className="time-slots-grid">
            {availableTimes.map((time) => (
              <button
                key={time}
                className={`time-slot-button ${
                  selectedTime === time ? "selected" : ""
                }`}
                onClick={() => setSelectedTime(time)}
              >
                {time.substring(0, 5)}
              </button>
            ))}
          </div>

          {availableTimes.length === 0 && (
            <p className="no-slots-message">No available time slots for this date.</p>
          )}

          <button
            className="book-appointment-button"
            onClick={handleBookAppointment}
            disabled={!selectedTime || isBooking}
          >
            {isBooking ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AvailableDateBox;