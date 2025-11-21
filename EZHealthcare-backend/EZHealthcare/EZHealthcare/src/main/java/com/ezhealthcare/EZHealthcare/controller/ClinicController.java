package com.ezhealthcare.EZHealthcare.controller;

import com.ezhealthcare.EZHealthcare.model.Clinic;
import com.ezhealthcare.EZHealthcare.service.ClinicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clinics")
@CrossOrigin(origins = "http://localhost:3000") // More secure than "*"
public class ClinicController {
    @Autowired
    private ClinicService clinicService;

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Clinic>> getClinicsByDoctor(@PathVariable Long doctorId) {
        try {
            List<Clinic> clinics = clinicService.getClinicsByDoctorId(doctorId);
            return ResponseEntity.ok(clinics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/search/clinics")
    public ResponseEntity<List<Clinic>> searchClinics(@RequestParam String name) {
        try {
            List<Clinic> clinics = clinicService.searchClinicsByName(name);
            return ResponseEntity.ok(clinics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Clinic>> getAllClinics() {
        try {
            List<Clinic> clinics = clinicService.getAllClinics();
            return ResponseEntity.ok(clinics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/{clinicId}/schedules")
    public ResponseEntity<?> addSchedulesToClinic(
            @PathVariable Long clinicId,
            @RequestBody List<?> schedules) {
        try {
            clinicService.addSchedulesToClinic(clinicId, schedules);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}