package com.ezhealthcare.EZHealthcare.controller;

import com.ezhealthcare.EZHealthcare.model.Doctor;
import com.ezhealthcare.EZHealthcare.service.DoctorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin("*") // Allow frontend requests
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping("/add")
    public ResponseEntity<?> createDoctor(@RequestPart("doctorData") String doctorDataStr,
                                          @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> doctorData = mapper.readValue(doctorDataStr, Map.class);

            // Create doctor with schedules
            Doctor doctor = doctorService.createDoctor(doctorData, image);

            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            e.printStackTrace(); // Add this for debugging
            return ResponseEntity.badRequest().body("Error creating doctor: " + e.getMessage());
        }
    }

    // Get all doctors
    @GetMapping("/all")
    public List<Doctor> getDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        System.out.println("Doctors: " + doctors); // Debugging
        return doctors;
    }

    // Fetch doctors by specialty ID
    @GetMapping("/specialty/{id}")
    public List<Doctor> getDoctorsBySpecialty(@PathVariable Long id) {
        return doctorService.getDoctorsBySpecialty(id);
    }

    // Get doctor by ID
    @GetMapping("/{id}")
    public Doctor getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }

    // Add a new doctor
    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorService.saveDoctor(doctor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("email") String email,
            @RequestParam("specialization") String specialization,
            @RequestParam(value = "degree", required = false) String degree,
            @RequestParam(value = "experience", required = false) String experience,
            @RequestParam(value = "hospitals", required = false) List<Long> hospitalIds,
            @RequestParam(value = "clinics", required = false) List<Long> clinicIds,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Doctor updatedDoctor = doctorService.updateDoctor(id, name, phoneNumber, email, specialization, degree, experience, hospitalIds, clinicIds, image, null);
            return ResponseEntity.ok(updatedDoctor);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Doctor() {{ setName("Error: " + e.getMessage()); }});
        }
    }

    @DeleteMapping("/{id}")
    public void deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
    }

    @GetMapping("/{doctorId}/locations")
    public ResponseEntity<?> getDoctorLocations(@PathVariable Long doctorId) {
        try {
            Map<String, Object> response = doctorService.getDoctorWithLocations(doctorId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Doctor not found or error fetching locations"));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> searchDoctors(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long hospitalId,
            @RequestParam(required = false) Long clinicId
    ) {
        return ResponseEntity.ok(doctorService.searchDoctors(query, hospitalId, clinicId));
    }

    @GetMapping("/schedule-locations")
    public ResponseEntity<Set<String>> getScheduleLocations() {
        try {
            Set<String> locations = doctorService.getScheduleLocations();
            return ResponseEntity.ok(locations);
        } catch (Exception e) {
            System.err.println("Error fetching schedule locations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}