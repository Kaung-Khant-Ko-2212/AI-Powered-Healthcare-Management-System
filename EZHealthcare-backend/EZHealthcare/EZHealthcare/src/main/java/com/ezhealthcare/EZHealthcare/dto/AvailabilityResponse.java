package com.ezhealthcare.EZHealthcare.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

public class AvailabilityResponse {
    private List<String> availableDates;
    private List<String> fullyBookedDates;
    private Map<String, TimeSlotAvailability> timeSlots;

    public static class TimeSlotAvailability {
        // Getters and setters
        @Setter
        @Getter
        private int bookedSlots;
        @Getter
        @Setter
        private int totalSlots;
        private boolean isAvailable;

        public boolean isAvailable() {
            return isAvailable;
        }

        public void setAvailable(boolean available) {
            isAvailable = available;
        }
    }

    // Getters and setters
    public List<String> getAvailableDates() {
        return availableDates;
    }

    public void setAvailableDates(List<String> availableDates) {
        this.availableDates = availableDates;
    }

    public List<String> getFullyBookedDates() {
        return fullyBookedDates;
    }

    public void setFullyBookedDates(List<String> fullyBookedDates) {
        this.fullyBookedDates = fullyBookedDates;
    }

    public Map<String, TimeSlotAvailability> getTimeSlots() {
        return timeSlots;
    }

    public void setTimeSlots(Map<String, TimeSlotAvailability> timeSlots) {
        this.timeSlots = timeSlots;
    }
}