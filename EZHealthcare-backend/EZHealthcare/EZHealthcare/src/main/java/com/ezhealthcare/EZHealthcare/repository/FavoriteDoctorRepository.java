package com.ezhealthcare.EZHealthcare.repository;

import com.ezhealthcare.EZHealthcare.model.FavoriteDoctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteDoctorRepository extends JpaRepository<FavoriteDoctor, Long> {
    // Find favorites by both doctorId and userId
    List<FavoriteDoctor> findByDoctorIdAndUserId(Long doctorId, Long userId);

    // Find all favorites for a specific user
    List<FavoriteDoctor> findByUserId(Long userId);
}
