package com.ezhealthcare.EZHealthcare.repository;

import com.ezhealthcare.EZHealthcare.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);

    @Query("SELECT d FROM Doctor d LEFT JOIN FETCH d.specialty")
    List<Doctor> findAllWithSpecialty();

    @Query("SELECT d FROM Doctor d JOIN FETCH d.specialty WHERE d.specialty.id = :specialtyId")
    List<Doctor> findBySpecialtyId(@Param("specialtyId") Long specialtyId);

    @Query("SELECT DISTINCT d FROM Doctor d " +
            "LEFT JOIN d.hospitals h " +
            "LEFT JOIN d.clinics c " +
            "WHERE (:query IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:hospitalId IS NULL OR h.id = :hospitalId) " +
            "AND (:clinicId IS NULL OR c.id = :clinicId)")
    List<Doctor> searchDoctors(
            @Param("query") String query,
            @Param("hospitalId") Long hospitalId,
            @Param("clinicId") Long clinicId
    );

    @Query("SELECT d FROM Doctor d LEFT JOIN FETCH d.specialty WHERE d.id = :id")
    Doctor findByIdWithSpecialty(@Param("id") Long id);

    @Query("SELECT d FROM Doctor d LEFT JOIN FETCH d.specialty LEFT JOIN FETCH d.hospitals LEFT JOIN FETCH d.clinics WHERE d.id = :id")
    Doctor findByIdWithSpecialtyAndLocations(@Param("id") Long id);

    @Query("SELECT d FROM Doctor d LEFT JOIN FETCH d.specialty LEFT JOIN FETCH d.hospitals LEFT JOIN FETCH d.clinics")
    List<Doctor> findAllWithSpecialtyAndLocations();
}