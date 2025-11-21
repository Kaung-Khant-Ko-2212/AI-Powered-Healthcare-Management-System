package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.model.FoodCategory;
import com.ezhealthcare.EZHealthcare.repository.FoodCategoryRepository;
import com.ezhealthcare.EZHealthcare.repository.FoodCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodCategoryService {
    @Autowired
    private FoodCategoryRepository foodcategoryRepository;

    public List<FoodCategory> getAllCategories() {
        return foodcategoryRepository.findAll();
    }
}
