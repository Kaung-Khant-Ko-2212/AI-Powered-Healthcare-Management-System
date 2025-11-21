package com.ezhealthcare.EZHealthcare.controller;

import com.ezhealthcare.EZHealthcare.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/appointments/doctor/{doctorId}/count")
    public ResponseEntity<Map<String, Long>> getTotalAppointmentsForDoctor(@PathVariable Long doctorId) {
        Long count = dashboardService.getTotalAppointmentsForDoctor(doctorId);
        return ResponseEntity.ok(Map.of("totalAppointments", count));
    }

    @GetMapping("/appointments/doctor/{doctorId}/patients/count")
    public ResponseEntity<Map<String, Long>> getTotalDistinctPatientsForDoctor(@PathVariable Long doctorId) {
        Long count = dashboardService.getTotalDistinctPatientsForDoctor(doctorId);
        return ResponseEntity.ok(Map.of("totalPatients", count));
    }

    @GetMapping("/doctors/count")
    public ResponseEntity<Map<String, Long>> getTotalDoctors() {
        Long count = dashboardService.getTotalDoctors();
        return ResponseEntity.ok(Map.of("totalDoctors", count));
    }
    @GetMapping("/appointment/count")
    public ResponseEntity<Map<String, Long>> getTotalAppointments() {
        Long count = dashboardService.getTotalAppointments();
        return ResponseEntity.ok(Map.of("totalAppointments", count));
    }
}