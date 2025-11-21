package com.ezhealthcare.EZHealthcare.repository;

import com.ezhealthcare.EZHealthcare.model.Doctor;
import com.ezhealthcare.EZHealthcare.model.ScheduleCancellationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface ScheduleCancellationRepository extends JpaRepository<ScheduleCancellationRequest, Long> {

    @Query("SELECT s.requestDate FROM ScheduleCancellationRequest s " +
            "WHERE s.doctor.id = :doctorId AND s.status = 'Approved'")
    List<Date> findApprovedCancellationDatesByDoctorId(@Param("doctorId") Long doctorId);

    // Query by the doctor relationship
    List<ScheduleCancellationRequest> findByDoctor(Doctor doctor);

    // Query by the doctor relationship and status
    List<ScheduleCancellationRequest> findByDoctorAndStatus(Doctor doctor, String status);

    // Check if a request exists for a specific doctor and date
    boolean existsByDoctorAndRequestDate(Doctor doctor, Date requestDate);

    // Query by status
    List<ScheduleCancellationRequest> findByStatus(String status);
}