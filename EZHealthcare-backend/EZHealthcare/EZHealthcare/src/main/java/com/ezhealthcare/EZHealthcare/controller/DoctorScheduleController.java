package com.ezhealthcare.EZHealthcare.controller;

import com.ezhealthcare.EZHealthcare.model.DoctorSchedule;
import com.ezhealthcare.EZHealthcare.service.DoctorScheduleService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/doctor-schedule")
@CrossOrigin("*")
public class DoctorScheduleController {

    @Autowired
    private DoctorScheduleService doctorScheduleService;

    // Fetch available dates for a doctor at a hospital
    @GetMapping("/{doctorId}/{locationId}/available-dates")
    public ResponseEntity<Set<LocalDate>> getAvailableDates(
            @PathVariable Long doctorId,
            @PathVariable Long locationId,
            @RequestParam String locationType) {
        try {
            Set<LocalDate> dates = doctorScheduleService.getAvailableDates(doctorId, locationId, locationType);
            return ResponseEntity.ok(dates);
        } catch (Exception e) {
            System.err.println("Error fetching available dates: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{doctorId}/{locationId}/available-times")
    public ResponseEntity<List<String>> getAvailableTimeSlots(
            @PathVariable Long doctorId,
            @PathVariable Long locationId,
            @RequestParam String locationType,
            @RequestParam String date) {
        try {
            List<String> times = doctorScheduleService.getAvailableTimeSlots(
                    doctorId, locationId, locationType, LocalDate.parse(date));
            return ResponseEntity.ok(times);
        } catch (Exception e) {
            System.err.println("Error fetching available time slots: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all schedules for a doctor
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorSchedule>> getDoctorSchedules(@PathVariable Long doctorId) {
        try {
            List<DoctorSchedule> schedules = doctorScheduleService.getSchedulesByDoctor(doctorId);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get schedules for a specific location
    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<DoctorSchedule>> getLocationSchedules(
            @PathVariable Long locationId,
            @RequestParam String locationType) {
        try {
            List<DoctorSchedule> schedules = locationType.equals("hospital") ?
                    doctorScheduleService.getSchedulesByHospital(locationId) :
                    doctorScheduleService.getSchedulesByClinic(locationId);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Save or update doctor schedules
    @PostMapping("/save")
    public ResponseEntity<?> saveSchedules(
            @RequestBody Map<String, Object> scheduleData) {
        try {
            doctorScheduleService.saveSchedules(scheduleData);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving schedules: " + e.getMessage());
        }
    }

    // Delete a schedule
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long scheduleId) {
        try {
            doctorScheduleService.deleteSchedule(scheduleId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting schedule: " + e.getMessage());
        }
    }

    @GetMapping("/doctor/{doctorId}/locations")
    public ResponseEntity<List<DoctorSchedule>> getDoctorScheduleWithLocations(@PathVariable Long doctorId) {
        try {
            List<DoctorSchedule> schedules = doctorScheduleService.getDoctorScheduleWithLocations(doctorId);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            System.err.println("Error fetching schedules with locations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{doctorId}")
    public ResponseEntity<String> updateDoctorSchedules(
            @PathVariable Long doctorId,
            @RequestBody Map<String, List<Map<String, Object>>> requestBody) {
        try {
            List<Map<String, Object>> schedules = requestBody.get("schedules");
            if (schedules == null) {
                return ResponseEntity.badRequest().body("Schedules list is missing");
            }
            // Pass the raw schedules directly to the service, preserving locationType
            doctorScheduleService.updateDoctorSchedules(doctorId, schedules);
            return ResponseEntity.ok("Schedules updated successfully");
        } catch (Exception e) {
            System.err.println("Error updating schedules for doctor ID " + doctorId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating schedules: " + e.getMessage());
        }
    }

}
