package com.ezhealthcare.EZHealthcare.controller;

import com.ezhealthcare.EZHealthcare.model.ScheduleCancellationRequest;
import com.ezhealthcare.EZHealthcare.service.ScheduleCancellationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/cancel-schedule")
@CrossOrigin(origins = "http://localhost:3000")
public class ScheduleCancellationController {

    @Autowired
    private ScheduleCancellationService service;

    @PostMapping
    public ResponseEntity<String> cancelSchedule(@RequestBody ScheduleCancellationRequest request) {
        try {
            // Validate required fields
            if (request.getDoctorId() == null || request.getReason() == null || request.getRequestDate() == null) {
                return ResponseEntity.badRequest().body("Doctor ID, reason, and request date are required.");
            }

            // Convert java.util.Date to java.sql.Date
            java.util.Date utilDate = request.getRequestDate();
            java.sql.Date sqlDate = new java.sql.Date(utilDate.getTime());
            request.setRequestDate(sqlDate);

            // Submit the request
            service.submitRequest(request);
            return ResponseEntity.ok("Cancellation request submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error submitting request: " + e.getMessage());
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ScheduleCancellationRequest>> getPendingRequests() {
        List<ScheduleCancellationRequest> requests = service.getPendingRequests();
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/request")
    public ResponseEntity<String> requestDateLock(@RequestParam Long doctorId, @RequestParam String date) {
        try {
            Date requestedDate = Date.valueOf(date);
            service.requestDateLock(doctorId, requestedDate);
            return ResponseEntity.ok("Date lock request submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error submitting date lock request: " + e.getMessage());
        }
    }

    @GetMapping("/approved")
    public ResponseEntity<List<ScheduleCancellationRequest>> getApprovedRequests() {
        List<ScheduleCancellationRequest> requests = service.getApprovedRequests();
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveRequest(@PathVariable Long id) {
        try {
            service.approveRequest(id);
            return ResponseEntity.ok("Request approved and appointments cancelled successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error approving request: " + e.getMessage());
        }
    }

    @GetMapping("/approved-dates/{doctorId}")
    public ResponseEntity<List<Date>> getApprovedCancellationDates(@PathVariable Long doctorId) {
        try {
            List<Date> approvedDates = service.getApprovedCancellationDates(doctorId);
            return ResponseEntity.ok(approvedDates);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

}