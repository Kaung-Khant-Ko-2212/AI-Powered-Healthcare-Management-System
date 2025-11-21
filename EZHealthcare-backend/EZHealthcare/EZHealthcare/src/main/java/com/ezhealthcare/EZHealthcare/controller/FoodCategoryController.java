package com.ezhealthcare.EZHealthcare.controller;

import com.ezhealthcare.EZHealthcare.model.FoodCategory;
import com.ezhealthcare.EZHealthcare.service.FoodCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foodcategories")
@CrossOrigin(origins = "http://localhost:3000")
public class FoodCategoryController {

    @Autowired
    private FoodCategoryService foodcategoryService;

    @GetMapping("/all")
    public List<FoodCategory> getAllCategories() {
        return foodcategoryService.getAllCategories();
    }
}
