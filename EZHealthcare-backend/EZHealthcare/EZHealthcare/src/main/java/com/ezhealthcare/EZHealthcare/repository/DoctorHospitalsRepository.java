package com.ezhealthcare.EZHealthcare.repository;

import com.ezhealthcare.EZHealthcare.model.DoctorHospitals;
import com.ezhealthcare.EZHealthcare.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorHospitalsRepository extends JpaRepository<DoctorHospitals, Long> {
    List<DoctorHospitals> findByDoctorId(Long doctorId);

}