package com.ezhealthcare.EZHealthcare.repository;

import com.ezhealthcare.EZHealthcare.model.Clinic;
import com.ezhealthcare.EZHealthcare.model.DoctorClinics;
import com.ezhealthcare.EZHealthcare.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorClinicsRepository extends JpaRepository<DoctorClinics, Long> {
    DoctorClinics clinic(Clinic clinic);
    List<DoctorClinics> findByDoctorId(Long doctorId);
}