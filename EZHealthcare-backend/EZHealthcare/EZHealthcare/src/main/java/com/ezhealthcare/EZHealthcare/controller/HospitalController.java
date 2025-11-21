package com.ezhealthcare.EZHealthcare.controller;
import com.ezhealthcare.EZHealthcare.model.Hospital;
import com.ezhealthcare.EZHealthcare.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
    @RequestMapping("/api/hospitals")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    // Get all hospitals with their doctors
    @GetMapping("/all")
    public List<Hospital> getAllHospitals() {
        return hospitalService.getAllHospitals();
    }

    @GetMapping("/search/hospitals")
    public List<Hospital> searchHospitals(@RequestParam String name) {
        return hospitalService.searchHospitalsByName(name);
    }

    // Get hospital by ID with its doctors
    @GetMapping("/{id}")
    public Hospital getHospitalWithDoctors(@PathVariable Long id) {
        return hospitalService.getHospitalById(id);
    }

    // Get hospitals by doctor ID
    @GetMapping("/doctor/{doctorId}")
    public List<Hospital> getHospitalsByDoctor(@PathVariable Long doctorId) {
        return hospitalService.getHospitalsByDoctorId(doctorId);
    }
}

