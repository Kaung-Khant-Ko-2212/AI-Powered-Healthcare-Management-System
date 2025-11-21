package com.ezhealthcare.EZHealthcare.controller;

import com.ezhealthcare.EZHealthcare.dto.StatusCount;
import com.ezhealthcare.EZHealthcare.exception.AppointmentLimitExceededException;
import com.ezhealthcare.EZHealthcare.model.Appointment;
import com.ezhealthcare.EZHealthcare.model.AppointmentRequest;
import com.ezhealthcare.EZHealthcare.model.AppointmentStatus;
import com.ezhealthcare.EZHealthcare.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long appointmentId) {
        try {
            // Change to find appointments by user ID instead of appointment ID
            List<Appointment> appointments = appointmentService.getUserAppointmentsByUserId(appointmentId);
            if (appointments.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Delete all appointments for the user
            for (Appointment appointment : appointments) {
                appointmentService.deleteAppointment(appointment.getId());
            }

            return ResponseEntity.ok().body(Map.of("message", "Appointments deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error deleting appointments: " + e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        try {
            List<Appointment> appointments = appointmentService.getAllAppointments();
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    // Fetch available time slots for a doctor at a hospital and date
    @GetMapping("/available")
    public List<Appointment> getAvailableTimeSlots(
            @RequestParam Long doctorId,
            @RequestParam Long hospitalId,
            @RequestParam String date
    ) {
        return appointmentService.getAvailableTimeSlots(doctorId, hospitalId, Date.valueOf(date));
    }
    @GetMapping("/time-slot-bookings")
    public ResponseEntity<Map<String, Integer>> getTimeSlotBookings(
            @RequestParam Long doctorId,
            @RequestParam Long locationId,
            @RequestParam String date
    ) {
        LocalDate localDate = LocalDate.parse(date);
        Map<String, Integer> bookings = appointmentService.getTimeSlotBookings(
                doctorId,
                locationId,
                localDate
        );
        return ResponseEntity.ok(bookings);
    }



    // Book an appointment
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestParam Long userId, @RequestBody AppointmentRequest payload) {
        try {
            Long doctorId = payload.getDoctorId();
            Long hospitalId = payload.getHospitalId();
            Long clinicId = payload.getClinicId(); // Add this line
            String appointmentDate = payload.getAppointmentDate();
            String appointmentTime = payload.getAppointmentTime();

            // Create a new Appointment object and set the values
            Appointment appointment = new Appointment();
            appointment.setAppointmentDate(Date.valueOf(appointmentDate));
            appointment.setAppointmentTime(Time.valueOf(appointmentTime));

            // Call the service to book the appointment with both hospitalId and clinicId
            Appointment bookedAppointment = appointmentService.bookAppointment(
                    userId,
                    doctorId,
                    clinicId,    // Add clinicId parameter
                    hospitalId,
                    appointment
            );

            return ResponseEntity.ok(bookedAppointment);
        } catch (AppointmentLimitExceededException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body(Map.of("error", "An error occurred while booking the appointment: " + e.getMessage()));
        }
    }

    @GetMapping("/status-counts")
    public ResponseEntity<List<StatusCount>> getStatusCounts() {
        return ResponseEntity.ok(appointmentService.getAppointmentCountsByStatus());
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatus(
            @PathVariable String status) {
        try {
            AppointmentStatus appointmentStatus = AppointmentStatus.valueOf(status.toUpperCase());
            List<Appointment> appointments = appointmentService.getAppointmentsByStatus(appointmentStatus);
            return ResponseEntity.ok(appointments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Appointment>> getUserAppointments(@PathVariable Long userId) {
        List<Appointment> appointments = appointmentService.getUserAppointments(userId);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            AppointmentStatus newStatus = AppointmentStatus.valueOf(statusUpdate.get("status"));
            Appointment updated = appointmentService.updateAppointmentStatus(appointmentId, newStatus);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body(Map.of("error", "Error updating appointment status: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAppointments(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String startDate) {
        try {
            if (userId != null && startDate != null) {
                LocalDate startLocalDate = LocalDate.parse(startDate);
                LocalDate endLocalDate = startLocalDate.plusDays(4);
                List<Appointment> appointments = appointmentService.getAppointmentsForFiveDays(userId, startLocalDate, endLocalDate);
                return ResponseEntity.ok(appointments);
            } else if (userId != null) {
                List<Appointment> appointments = appointmentService.getUserAppointments(userId);
                return ResponseEntity.ok(appointments);
            } else {
                return ResponseEntity.badRequest().body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorWithDetails(doctorId));
    }

    // New endpoint: Total appointments count for a doctor
    @GetMapping("/doctor/{doctorId}/count")
    public ResponseEntity<Long> getTotalAppointmentsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getTotalAppointmentsByDoctor(doctorId));
    }

    // New endpoint: Total distinct patients count for a doctor
    @GetMapping("/doctor/{doctorId}/patients/count")
    public ResponseEntity<Long> getTotalPatientsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getTotalPatientsByDoctor(doctorId));
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByHospital(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByHospital(hospitalId));
    }

    @GetMapping("/clinic/{clinicId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByClinic(@PathVariable Long clinicId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByClinic(clinicId));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Appointment>> getAppointments(@RequestParam Long userId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByUser(userId);
        return ResponseEntity.ok(appointments);
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.createAppointment(appointment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        Optional<Appointment> updatedAppointmentOptional = appointmentService.updateAppointment(id, appointment);
        if (updatedAppointmentOptional.isPresent()) {
            return ResponseEntity.ok(updatedAppointmentOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
//        if (appointmentService.deleteAppointment(id)) {
//            return ResponseEntity.noContent().build();
//        }
//        return ResponseEntity.notFound().build();
//    }

}
