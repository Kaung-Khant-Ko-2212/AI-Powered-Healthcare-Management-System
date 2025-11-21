package com.ezhealthcare.EZHealthcare.repository;

import com.ezhealthcare.EZHealthcare.model.DayOfWeek;
import com.ezhealthcare.EZHealthcare.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    List<DoctorSchedule> findByDoctorIdAndHospitalId(Long doctorId, Long hospitalId);
    List<DoctorSchedule> findByDoctorIdAndClinicId(Long doctorId, Long clinicId);
    List<DoctorSchedule> findByDoctorIdAndHospitalIdAndDayOfWeek(Long doctorId, Long hospitalId, DayOfWeek dayOfWeek);
    List<DoctorSchedule> findByDoctorIdAndClinicIdAndDayOfWeek(Long doctorId, Long clinicId, DayOfWeek dayOfWeek);
    // Basic queries
    List<DoctorSchedule> findByDoctorId(Long doctorId);
    List<DoctorSchedule> findByClinicId(Long clinicId);
    List<DoctorSchedule> findByHospitalId(Long hospitalId);

    // Delete doctor's schedules
    void deleteByDoctorId(Long doctorId);

    List<DoctorSchedule> findByHospitalIdAndDayOfWeek(Long hospitalId, DayOfWeek dayOfWeek);

    List<DoctorSchedule> findByClinicIdAndDayOfWeek(Long clinicId, DayOfWeek dayOfWeek);

    @Query("SELECT ds FROM DoctorSchedule ds LEFT JOIN FETCH ds.hospital LEFT JOIN FETCH ds.clinic WHERE ds.doctor.id = :doctorId")
    List<DoctorSchedule> findByDoctor_IdWithLocations(@Param("doctorId") Long doctorId);

    // Added to check for duplicates
    Optional<DoctorSchedule> findByDoctorIdAndHospitalIdAndClinicIdAndDayOfWeek(
            Long doctorId, Long hospitalId, Long clinicId, DayOfWeek dayOfWeek
    );



}
