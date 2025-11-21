package com.ezhealthcare.EZHealthcare.repository;

import com.ezhealthcare.EZHealthcare.dto.StatusCount;
import com.ezhealthcare.EZHealthcare.model.Appointment;
import com.ezhealthcare.EZHealthcare.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Fetch appointments for a specific doctor, hospital, and date
    List<Appointment> findByDoctorIdAndHospitalIdAndAppointmentDate(Long doctorId, Long hospitalId, Date date);
    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, Date appointmentDate);
    @Query("SELECT COUNT(a) FROM Appointment a WHERE " +
            "a.doctor.id = :doctorId AND " +
            "a.hospital.id = :hospitalId AND " +
            "a.appointmentDate = :appointmentDate AND " +
            "a.appointmentTime = :appointmentTime")
    int countExistingAppointments(
            @Param("doctorId") Long doctorId,
            @Param("hospitalId") Long hospitalId,
            @Param("appointmentDate") Date appointmentDate,
            @Param("appointmentTime") Time appointmentTime
    );

    @Query("SELECT COUNT(a) FROM Appointment a WHERE " +
            "a.doctor.id = :doctorId AND " +
            "a.hospital.id = :hospitalId AND " +
            "a.appointmentDate = :appointmentDate AND " +
            "a.appointmentTime = :appointmentTime AND " +
            "a.user.id = :userId")
    int countUserAppointments(
            @Param("doctorId") Long doctorId,
            @Param("hospitalId") Long hospitalId,
            @Param("appointmentDate") Date appointmentDate,
            @Param("appointmentTime") Time appointmentTime,
            @Param("userId") Long userId
    );

    // Get appointments count by status
    @Query("SELECT a.status as status, COUNT(a) as count FROM Appointment a GROUP BY a.status")
    List<StatusCount> getAppointmentCountsByStatus();

    // Get appointments by status
    List<Appointment> findByStatus(AppointmentStatus status);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByUserId(Long userId);
    List<Appointment> findByHospitalId(Long hospitalId);
    List<Appointment> findByClinicId(Long clinicId);
    // Get all appointments with user, doctor, and hospital details
    @Query("SELECT a FROM Appointment a " +
            "JOIN FETCH a.user u " +
            "JOIN FETCH a.doctor d " +
            "JOIN FETCH a.hospital h " +
            "WHERE a.status = :status")
    List<Appointment> findAppointmentsWithDetails(@Param("status") AppointmentStatus status);

    @Query("SELECT a FROM Appointment a " +
            "LEFT JOIN FETCH a.doctor " +
            "LEFT JOIN FETCH a.hospital " +
            "WHERE a.user.id = :userId " +
            "ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findByUserIdOrderByAppointmentDateDescAppointmentTimeDesc(
            @Param("userId") Long userId
    );

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId")
    Long countByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId")
    List<Appointment> findByUserIdOrderByAppointmentDateDescAppointmentTime(Long userId);
    long countByDoctorIdAndHospitalIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
            Long doctorId,
            Long hospitalId,
            LocalDate appointmentDate,
            Time appointmentTime,
            AppointmentStatus status
    );

    @Query("SELECT a.appointmentTime, COUNT(a) FROM Appointment a " +
            "WHERE a.doctor.id = :doctorId " +
            "AND a.hospital.id = :hospitalId " +
            "AND a.appointmentDate = :date " +
            "AND a.status != 'CANCELLED' " +
            "GROUP BY a.appointmentTime")
    List<Object[]> countBookingsByTimeSlot(
            @Param("doctorId") Long doctorId,
            @Param("hospitalId") Long hospitalId,
            @Param("date") LocalDate date
    );

    @Query("SELECT COUNT(a) FROM Appointment a WHERE " +
            "a.doctor.id = :doctorId AND " +
            "a.clinic.id = :clinicId AND " +
            "a.appointmentDate = :appointmentDate AND " +
            "a.appointmentTime = :appointmentTime")
    int countExistingAppointmentsForClinic(
            @Param("doctorId") Long doctorId,
            @Param("clinicId") Long clinicId,
            @Param("appointmentDate") Date appointmentDate,
            @Param("appointmentTime") Time appointmentTime
    );

    @Query("SELECT COUNT(a) FROM Appointment a WHERE " +
            "a.doctor.id = :doctorId AND " +
            "a.hospital.id = :hospitalId AND " +
            "a.appointmentDate = :appointmentDate AND " +
            "a.appointmentTime = :appointmentTime")
    int countExistingAppointmentsForHospital(
            @Param("doctorId") Long doctorId,
            @Param("hospitalId") Long hospitalId,
            @Param("appointmentDate") Date appointmentDate,
            @Param("appointmentTime") Time appointmentTime
    );
    @Query("SELECT COUNT(a) FROM Appointment a WHERE " +
            "a.doctor.id = :doctorId AND " +
            "a.clinic.id = :clinicId AND " +
            "a.appointmentDate = :appointmentDate AND " +
            "a.appointmentTime = :appointmentTime AND " +
            "a.user.id = :userId")
    int countUserAppointmentsForClinic(
            @Param("doctorId") Long doctorId,
            @Param("clinicId") Long clinicId,
            @Param("appointmentDate") Date appointmentDate,
            @Param("appointmentTime") Time appointmentTime,
            @Param("userId") Long userId
    );
    @Query("SELECT a FROM Appointment a " +
            "JOIN FETCH a.user u " +
            "JOIN FETCH a.doctor d " +
            "JOIN FETCH a.clinic c " + // Include clinic
            "WHERE a.status = :status")
    List<Appointment> findAppointmentsWithDetailsForClinics(@Param("status") AppointmentStatus status);

    @Modifying
    @Query("DELETE FROM Appointment a WHERE a.user.id = :userId")
    void deleteByUserId(Long userId);



    @Modifying
    @Query("DELETE FROM Appointment a WHERE a.id = :appointmentId")
    void deleteById(Long appointmentId);



    @Modifying
    @Query("DELETE FROM Notification n WHERE n.appointment.id = :appointmentId")
    void deleteNotificationsByAppointmentId(@Param("appointmentId") Long appointmentId);

    @Modifying
    @Query("DELETE FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :appointmentDate")
    void deleteByDoctorIdAndAppointmentDate(@Param("doctorId") Long doctorId, @Param("appointmentDate") Date appointmentDate);

    // Fetch appfindByDoctorIdAndHospitalIdAndAppointmentDateointments for a specific doctor with details
    @Query("SELECT a FROM Appointment a " +
            "JOIN FETCH a.user u " +
            "JOIN FETCH a.doctor d " +
            "LEFT JOIN FETCH a.hospital h " +
            "LEFT JOIN FETCH a.clinic c " +
            "WHERE a.doctor.id = :doctorId " +
            "ORDER BY a.appointmentDate ASC, a.appointmentTime ASC")
    List<Appointment> findByDoctorIdWithDetails(@Param("doctorId") Long doctorId);

    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId AND a.appointmentDate BETWEEN :startDate AND :endDate")
    List<Appointment> findAppointmentsInDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
    // Count distinct patients (user_id) for a doctor
    @Query("SELECT COUNT(DISTINCT a.user.id) FROM Appointment a WHERE a.doctor.id = :doctorId")
    Long countDistinctPatientsByDoctorId(@Param("doctorId") Long doctorId);
}
