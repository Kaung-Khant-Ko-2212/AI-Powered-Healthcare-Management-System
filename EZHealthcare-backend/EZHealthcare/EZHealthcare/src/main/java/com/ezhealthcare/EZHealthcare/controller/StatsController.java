package com.ezhealthcare.EZHealthcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ezhealthcare.EZHealthcare.service.StatsService;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping("/gender")
    public ResponseEntity<Map<String, Integer>> getGenderStats() {
        Map<String, Integer> stats = statsService.getCombinedGenderStats();
        return ResponseEntity.ok(stats);
    }
}