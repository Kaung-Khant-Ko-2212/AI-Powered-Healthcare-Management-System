package com.ezhealthcare.EZHealthcare.controller;

import com.ezhealthcare.EZHealthcare.model.Specialty;
import com.ezhealthcare.EZHealthcare.service.SpecialtyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/specialties")
@CrossOrigin("*") // Allow frontend requests
public class SpecialtyController {

    @Autowired
    private SpecialtyService specialtyService;

    // Get all hospitals with their doctors
//    @GetMapping("/all")
//    public List<Specialty> getSpecialties() {
//        return specialtyService.getAllSpecialties();
//    }

    @GetMapping("/all")
    public List<Specialty> getSpecialties() {
        return specialtyService.getAllSpecialties();
    }

//    @GetMapping("/all")
//    public ResponseEntity<List<Specialty>> getAllSpecialties() {
//        try {
//            List<Specialty> specialties = specialtyRepository.findAll();
//            return ResponseEntity.ok(specialties);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }

}

