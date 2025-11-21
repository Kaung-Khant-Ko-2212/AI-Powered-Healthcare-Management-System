package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.model.Hospital;
import com.ezhealthcare.EZHealthcare.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    // Fetch all hospitals (with their doctors)
    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    // Fetch a single hospital by ID (with its doctors)
    public Hospital getHospitalById(Long id) {
        Optional<Hospital> hospital = hospitalRepository.findById(id);
        return hospital.orElse(null);  // Return the hospital or null if not found
    }

    public List<Hospital> searchHospitalsByName(String name) {
        return hospitalRepository.findByNameContainingIgnoreCase(name);
    }

    // Get hospitals for a specific doctor
    public List<Hospital> getHospitalsByDoctorId(Long doctorId) {
        return hospitalRepository.findByDoctors_Id(doctorId);
    }
}
