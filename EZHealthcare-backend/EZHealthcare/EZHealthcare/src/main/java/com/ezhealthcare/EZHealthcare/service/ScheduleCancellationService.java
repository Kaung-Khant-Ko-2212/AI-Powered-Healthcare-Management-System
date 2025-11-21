package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.model.*;
import com.ezhealthcare.EZHealthcare.repository.AppointmentRepository;
import com.ezhealthcare.EZHealthcare.repository.DoctorRepository;
import com.ezhealthcare.EZHealthcare.repository.ScheduleCancellationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
public class ScheduleCancellationService {

    @Autowired
    private ScheduleCancellationRepository repository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public void submitRequest(ScheduleCancellationRequest request) {
        if (request.getDoctorId() == null) {
            throw new RuntimeException("Doctor ID is required.");
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Set the doctor in the request
        request.setDoctor(doctor);

        // Fetch appointments for the doctor on the requested date
        List<Appointment> appointmentsToCancel = appointmentRepository.findByDoctorIdAndAppointmentDate(
                request.getDoctor().getId(), request.getRequestDate());

        System.out.println("Appointments to cancel: " + appointmentsToCancel.size()); // Debugging

        // Notify users whose appointments will be cancelled
        for (Appointment appointment : appointmentsToCancel) {
            User user = appointment.getUser();
            String message = "Your appointment with Dr. " + request.getDoctor().getName() +
                    " on " + request.getRequestDate() + " has been canceled. " +
                    "Click here to reschedule: http://localhost:3000/doctor/" + request.getDoctor().getId();

            System.out.println("Creating notification for user: " + user.getId()); // Debugging
            notificationService.createNotification(user, appointment, "cancelled", message);

            // Mark the appointment as CANCELLED
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointmentRepository.save(appointment);
        }

        // Save the cancellation request
        repository.save(request);
    }

    @Transactional
    public void requestDateLock(Long doctorId, Date requestedDate) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!repository.existsByDoctorAndRequestDate(doctor, requestedDate)) {
            ScheduleCancellationRequest request = new ScheduleCancellationRequest();
            request.setDoctor(doctor);
            request.setRequestDate(requestedDate);
            request.setStatus("Pending");
            repository.save(request);
        }
    }


    public void approveDateLockRequest(Long requestId) {
        repository.findById(requestId).ifPresent(request -> {
            request.setStatus("Approved");
            repository.save(request);
        });
    }

    public List<ScheduleCancellationRequest> getApprovedLockedDates(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return repository.findByDoctorAndStatus(doctor, "Approved");
    }

    public List<ScheduleCancellationRequest> getPendingRequests() {
        return repository.findByStatus("Pending");
    }

    public List<ScheduleCancellationRequest> getApprovedRequests() {
        return repository.findByStatus("Approved");
    }

    @Transactional
    public void approveRequest(Long requestId) {
        ScheduleCancellationRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Fetch appointments for the doctor on the requested date
        List<Appointment> appointmentsToCancel = appointmentRepository.findByDoctorIdAndAppointmentDate(
                request.getDoctor().getId(), request.getRequestDate());

        // Notify users whose appointments will be cancelled
        for (Appointment appointment : appointmentsToCancel) {
            User user = appointment.getUser();
            String message = "Your appointment with " + request.getDoctor().getName() +
                    " on " + request.getRequestDate() + " has been canceled. " +
                    "Reason: " + request.getReason() + "\n";

            System.out.println("Creating notification for user: " + user.getId()); // Debugging
            notificationService.createNotification(user, appointment, "cancelled", message);

            // Mark the appointment as CANCELLED
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointmentRepository.save(appointment);
        }

        // Update the request status to "Approved"
        request.setStatus("Approved");
        repository.save(request);
    }

    public ScheduleCancellationRequest getRequestById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void updateRequest(ScheduleCancellationRequest request) {
        repository.save(request);
    }

    public List<Date> getApprovedCancellationDates(Long doctorId) {
        return repository.findApprovedCancellationDatesByDoctorId(doctorId);
    }
}