package com.ezhealthcare.EZHealthcare.controller;

import com.ezhealthcare.EZHealthcare.model.Doctor;
import com.ezhealthcare.EZHealthcare.model.FavoriteDoctor;
import com.ezhealthcare.EZHealthcare.service.FavoriteDoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin("*")
public class FavoriteDoctorController {

    @Autowired
    private FavoriteDoctorService favoriteDoctorService;

    @GetMapping("/all")
    public ResponseEntity<List<Doctor>> getAllFavoriteDoctors(@RequestParam Long userId) {
        try {
            List<Doctor> favoriteDoctors = favoriteDoctorService.getAllFavoriteDoctors(userId);
            return ResponseEntity.ok(favoriteDoctors);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @PostMapping("/add")
    public FavoriteDoctor addToFavorites(@RequestParam Long doctorId, @RequestParam Long userId) {
        return favoriteDoctorService.addToFavorites(doctorId, userId);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromFavorites(@RequestParam Long doctorId, @RequestParam Long userId) {
        try {
            favoriteDoctorService.removeFromFavorites(doctorId, userId);
            return ResponseEntity.ok("Doctor removed from favorites!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
