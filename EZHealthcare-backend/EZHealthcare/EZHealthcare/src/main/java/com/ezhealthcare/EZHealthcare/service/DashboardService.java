package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.repository.AppointmentRepository;
import com.ezhealthcare.EZHealthcare.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;

    @Autowired
    public DashboardService(AppointmentRepository appointmentRepository, DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
    }

    /**
     * Fetches the total number of appointments for a specific doctor.
     *
     * @param doctorId The ID of the doctor.
     * @return The total number of appointments for the given doctor.
     */
    public Long getTotalAppointmentsForDoctor(Long doctorId) {
        return appointmentRepository.countByDoctorId(doctorId);
    }

    /**
     * Fetches the total number of distinct patients for a specific doctor.
     *
     * @param doctorId The ID of the doctor.
     * @return The total number of distinct patients for the given doctor.
     */
    public Long getTotalDistinctPatientsForDoctor(Long doctorId) {
        return appointmentRepository.countDistinctPatientsByDoctorId(doctorId);
    }

    /**
     * Fetches the total number of doctors in the system.
     *
     * @return The total number of doctors.
     */
    public Long getTotalDoctors() {
        return doctorRepository.count();
    }
    public Long getTotalAppointments() {
        return appointmentRepository.count();
    }
}