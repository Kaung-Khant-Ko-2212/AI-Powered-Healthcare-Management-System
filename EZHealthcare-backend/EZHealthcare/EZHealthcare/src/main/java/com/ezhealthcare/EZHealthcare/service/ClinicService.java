package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.model.Clinic;
import com.ezhealthcare.EZHealthcare.repository.ClinicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClinicService {
    @Autowired
    private ClinicRepository clinicRepository;

    public List<Clinic> searchClinicsByName(String name) {
        return clinicRepository.findByNameContainingIgnoreCase(name);
    }
    public <Schedule> void addSchedulesToClinic(Long clinicId, List<Schedule> schedules) {
    }
    public List<Clinic> getClinicsByDoctorId(Long doctorId) {
        return clinicRepository.findByDoctors_Id(doctorId);
    }
    public List<Clinic> getAllClinics() {
        return clinicRepository.findAll();
    }
}
