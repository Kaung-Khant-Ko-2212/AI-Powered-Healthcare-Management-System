package com.ezhealthcare.EZHealthcare.repository;

import com.ezhealthcare.EZHealthcare.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findByDoctors_Id(Long doctorId); // ✅ Find hospitals for a specific doctor
    List<Hospital> findByNameContainingIgnoreCase(String name);
}
