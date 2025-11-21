package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.model.Food;
import com.ezhealthcare.EZHealthcare.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    public List<Food> getAllFoodItems() {
        return foodRepository.findAll();
    }
//    public List<Food> getFoodItemsByCategory(Long categoryId) {
//        return foodRepository.findByCategoryId(categoryId);
//    }
    public List<Food> findByCategory(Long categoryId) {
        return foodRepository.findByCategoryId(categoryId);
    }
}
