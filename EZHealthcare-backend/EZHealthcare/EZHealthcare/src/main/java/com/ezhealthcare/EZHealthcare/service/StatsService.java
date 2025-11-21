package com.ezhealthcare.EZHealthcare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ezhealthcare.EZHealthcare.repository.UserRepository;
import java.util.HashMap;
import java.util.Map;

@Service
public class StatsService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, Integer> getCombinedGenderStats() {
        Map<String, Integer> stats = new HashMap<>();

        // Get combined counts for both users and doctors
        int maleCount = userRepository.countByGender("MALE");
        int femaleCount = userRepository.countByGender("FEMALE");

        stats.put("maleCount", maleCount);
        stats.put("femaleCount", femaleCount);

        return stats;
    }
}