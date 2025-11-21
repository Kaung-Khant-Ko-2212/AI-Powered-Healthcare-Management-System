package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.model.Doctor;
import com.ezhealthcare.EZHealthcare.model.FavoriteDoctor;
import com.ezhealthcare.EZHealthcare.model.User;
import com.ezhealthcare.EZHealthcare.repository.DoctorRepository;
import com.ezhealthcare.EZHealthcare.repository.FavoriteDoctorRepository;
import com.ezhealthcare.EZHealthcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FavoriteDoctorService {

    @Autowired
    private FavoriteDoctorRepository favoriteDoctorRepository;

    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Doctor> getAllFavoriteDoctors(Long userId) {
        // Fetch only favorite doctors for the specific user
        List<FavoriteDoctor> favorites = favoriteDoctorRepository.findByUserId(userId);

        // Map the FavoriteDoctor objects to Doctor objects and return them
        return favorites.stream()
                .map(FavoriteDoctor::getDoctor)
                .collect(Collectors.toList());
    }

    public FavoriteDoctor addToFavorites(Long doctorId, Long userId) {
        Optional<Doctor> doctor = doctorRepository.findById(doctorId);
        Optional<User> user = userRepository.findById(userId);  // Ensure the user exists

        if (doctor.isPresent() && user.isPresent()) {
            // Check if this doctor is already added to the user's favorites
            List<FavoriteDoctor> existingFavorites = favoriteDoctorRepository.findByDoctorIdAndUserId(doctorId, userId);
            if (existingFavorites.isEmpty()) {
                // If the doctor is not already in the favorites, add it
                FavoriteDoctor favorite = new FavoriteDoctor(doctor.get(), user.get());
                return favoriteDoctorRepository.save(favorite);
            } else {
                throw new RuntimeException("Doctor already in favorites for this user!");
            }
        } else {
            throw new RuntimeException("Doctor or User not found!");
        }
    }
    public void removeFromFavorites(Long doctorId, Long userId) {
        List<FavoriteDoctor> favorites = favoriteDoctorRepository.findByDoctorIdAndUserId(doctorId, userId);

        if (!favorites.isEmpty()) {
            favoriteDoctorRepository.deleteAll(favorites);  // Delete all entries
        } else {
            throw new RuntimeException("Doctor is not in favorites!");
        }
    }
}
