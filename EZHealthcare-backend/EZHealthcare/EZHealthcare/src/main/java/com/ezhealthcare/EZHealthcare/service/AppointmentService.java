package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.dto.StatusCount;
import com.ezhealthcare.EZHealthcare.exception.AppointmentLimitExceededException;
import com.ezhealthcare.EZHealthcare.exception.DuplicateAppointmentException;
import com.ezhealthcare.EZHealthcare.model.*;
import com.ezhealthcare.EZHealthcare.repository.*;
import com.ezhealthcare.EZHealthcare.util.RateLimiter;
import com.ezhealthcare.EZHealthcare.util.TimeZoneUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
public class AppointmentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private ClinicRepository clinicRepository;
    @Autowired
    private RateLimiter rateLimiter;
    @Autowired
    private NotificationRepository notificationRepository;
    private static final int MAX_APPOINTMENTS_PER_SLOT = 5;

    public Map<String, Integer> getTimeSlotBookings(Long doctorId, Long hospitalId, LocalDate date) {
        List<Object[]> bookings = appointmentRepository.countBookingsByTimeSlot(
                doctorId,
                hospitalId,
                date
        );

        Map<String, Integer> bookingCounts = new HashMap<>();
        for (Object[] booking : bookings) {
            String time = ((Time) booking[0]).toString();
            Long count = (Long) booking[1];
            bookingCounts.put(time, count.intValue());
        }

        return bookingCounts;
    }
    // Fetch available time slots for a doctor at a selected hospital and date
    public List<Appointment> getAvailableTimeSlots(Long doctorId, Long hospitalId, Date date) {
        return appointmentRepository.findByDoctorIdAndHospitalIdAndAppointmentDate(doctorId, hospitalId, date);
    }

    // Save a new appointment (booking)
    public Appointment bookAppointment(Long userId, Long doctorId, Long clinicId, Long hospitalId, Appointment appointment) {
        // Check rate limits
        rateLimiter.checkRateLimit(userId);
        // Check for duplicate appointments
        boolean hasDuplicate = checkDuplicateAppointment(userId, doctorId, hospitalId, clinicId,
                appointment.getAppointmentDate(), appointment.getAppointmentTime());
        if (hasDuplicate) {
            throw new DuplicateAppointmentException("You already have an appointment at this time");
        }

        // Check appointment slot limit
        int existingAppointments;
        if (hospitalId != null) {
            existingAppointments = appointmentRepository.countExistingAppointmentsForHospital(
                    doctorId, hospitalId, appointment.getAppointmentDate(), appointment.getAppointmentTime());
        } else {
            existingAppointments = appointmentRepository.countExistingAppointmentsForClinic(
                    doctorId, clinicId, appointment.getAppointmentDate(), appointment.getAppointmentTime());
        }

        if (existingAppointments >= MAX_APPOINTMENTS_PER_SLOT) {
            throw new AppointmentLimitExceededException("This time slot is fully booked");
        }

        // Validate that either hospitalId or clinicId is provided, but not both
        if ((hospitalId != null && clinicId != null) || (hospitalId == null && clinicId == null)) {
            throw new IllegalArgumentException("Must provide either hospital or clinic ID, but not both");
        }

        // Convert date and time to Myanmar timezone
        Date adjustedDate = TimeZoneUtil.convertToMyanmarDate(appointment.getAppointmentDate());
        Time adjustedTime = TimeZoneUtil.convertToMyanmarTime(appointment.getAppointmentTime());

        appointment.setAppointmentDate(adjustedDate);
        appointment.setAppointmentTime(adjustedTime);


        // Fetch entities
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Set relationships
        appointment.setDoctor(doctor);
        appointment.setUser(user);

        // Set location based on type
        if (hospitalId != null) {
            Hospital hospital = hospitalRepository.findById(hospitalId)
                    .orElseThrow(() -> new RuntimeException("Hospital not found with ID: " + hospitalId));
            appointment.setHospital(hospital);
        } else {
            Clinic clinic = clinicRepository.findById(clinicId)
                    .orElseThrow(() -> new RuntimeException("Clinic not found with ID: " + clinicId));
            appointment.setClinic(clinic);
        }

        // Set default status
        appointment.setStatus(AppointmentStatus.PENDING);

        return appointmentRepository.save(appointment);
    }
    private boolean checkDuplicateAppointment(Long userId, Long doctorId, Long hospitalId, Long clinicId,
                                              Date appointmentDate, Time appointmentTime) {
        if (hospitalId != null) {
            return appointmentRepository.countUserAppointments(
                    doctorId, hospitalId, appointmentDate, appointmentTime, userId) > 0;
        } else {
            return appointmentRepository.countUserAppointmentsForClinic(
                    doctorId, clinicId, appointmentDate, appointmentTime, userId) > 0;
        }
    }

    public List<StatusCount> getAppointmentCountsByStatus() {
        return appointmentRepository.getAppointmentCountsByStatus();
    }

    public List<Appointment> getAppointmentsByStatus(AppointmentStatus status) {
        List<Appointment> hospitalAppointments = appointmentRepository.findAppointmentsWithDetails(status);
        List<Appointment> clinicAppointments = appointmentRepository.findAppointmentsWithDetailsForClinics(status);

        // Combine both lists
        hospitalAppointments.addAll(clinicAppointments);
        return hospitalAppointments;
    }

    public List<Appointment> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();

        // Load relationships eagerly if needed (for patient and hospital details)
        for (Appointment appointment : appointments) {
            appointment.getUser();  // Load user (patient) info
            appointment.getHospital();  // Load hospital info
        }

        return appointments;
    }




    @Transactional
    public Appointment updateAppointmentStatus(Long appointmentId, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Only allow cancellation of pending appointments
        if (newStatus == AppointmentStatus.CANCELLED &&
                appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new IllegalStateException("Only pending appointments can be cancelled");
        }

        appointment.setStatus(newStatus);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        // Create notification for status change
        String message = "";
        if (newStatus == AppointmentStatus.CANCELLED) {
            message = "Your appointment with Dr. " + appointment.getDoctor().getName() +
                    " on " + appointment.getAppointmentDate() + " has been canceled. " +
                    "Click here to reschedule: http://localhost:3000/doctor/" + appointment.getDoctor().getId();
        } else if (newStatus == AppointmentStatus.CONFIRMED) {
            message = "Your appointment with Dr. " + appointment.getDoctor().getName() +
                    " on " + appointment.getAppointmentDate() + " has been confirmed.";
        }

        notificationService.createNotification(
                appointment.getUser(),
                appointment,
                newStatus.toString().toLowerCase(),
                message);

        return updatedAppointment;
    }

    public List<Appointment> getUserAppointments(Long userId) {
        List<Appointment> appointments = appointmentRepository.findByUserIdOrderByAppointmentDateDescAppointmentTimeDesc(userId);

        // Load relationships
        for (Appointment appointment : appointments) {
            appointment.getUser();  // Load user (patient) info
            appointment.getHospital();  // Load hospital info
        }

        return appointments;
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Delete all appointments for this user first
        appointmentRepository.deleteByUserId(userId);

        // Then delete the user
        userRepository.delete(user);
    }
    @Transactional
    public List<Appointment> getUserAppointmentsByUserId(Long userId) {
        return appointmentRepository.findByUserIdOrderByAppointmentDateDescAppointmentTime(userId);
    }
    @Transactional
    public void deleteAppointment(Long appointmentId) {
        // First delete associated notifications
        notificationRepository.deleteByAppointmentId(appointmentId);
        // Then delete the appointment
        appointmentRepository.deleteById(appointmentId);
    }

    @Transactional
    public List<Appointment> deleteAppointmentsByDoctorAndDate(Long doctorId, Date appointmentDate) {
        // Fetch all appointments for the doctor on the given date
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, appointmentDate);

        // Delete notifications associated with these appointments
        for (Appointment appointment : appointments) {
            notificationRepository.deleteNotificationsByAppointmentId(appointment.getId());
        }

        // Delete the appointments
        appointmentRepository.deleteByDoctorIdAndAppointmentDate(doctorId, appointmentDate);

        return appointments;
    }



    public List<Appointment> getAppointmentsByDoctorWithDetails(Long doctorId) {
        return appointmentRepository.findByDoctorIdWithDetails(doctorId);
    }

    // New method: Get total appointments count for a doctor
    public Long getTotalAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.countByDoctorId(doctorId);
    }

    // New method: Get total distinct patients count for a doctor
    public Long getTotalPatientsByDoctor(Long doctorId) {
        return appointmentRepository.countDistinctPatientsByDoctorId(doctorId);
    }


    public List<Appointment> getAppointmentsForFiveDays(Long userId, LocalDate startDate, LocalDate endDate) {
        return appointmentRepository.findAppointmentsInDateRange(userId, startDate, endDate);
    }


    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByUser(Long userId) {
        return appointmentRepository.findByUserId(userId);
    }

    public List<Appointment> getAppointmentsByHospital(Long hospitalId) {
        return appointmentRepository.findByHospitalId(hospitalId);
    }

    public List<Appointment> getAppointmentsByClinic(Long clinicId) {
        return appointmentRepository.findByClinicId(clinicId);
    }

    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public Optional<Appointment> updateAppointment(Long id, Appointment appointment) {
        Optional<Appointment> existingAppointment = appointmentRepository.findById(id);

        if (existingAppointment.isPresent()) {
            Appointment updatedAppointment = existingAppointment.get();
            updatedAppointment.setAppointmentDate(appointment.getAppointmentDate());
            updatedAppointment.setAppointmentTime(appointment.getAppointmentTime());
            appointmentRepository.save(updatedAppointment);
            return Optional.of(updatedAppointment);
        }

        return Optional.empty();
    }


}
