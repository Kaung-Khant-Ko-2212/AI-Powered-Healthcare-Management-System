package com.ezhealthcare.EZHealthcare.controller;

import com.ezhealthcare.EZHealthcare.model.Food;
import com.ezhealthcare.EZHealthcare.model.Category;
import com.ezhealthcare.EZHealthcare.service.FoodService;
import com.ezhealthcare.EZHealthcare.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-items")
@CrossOrigin(origins = "http://localhost:3000")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @Autowired
    private CategoryService categoryService;

    // Display all food items
    @GetMapping
    public List<Food> getAllFoodItems() {
        return foodService.getAllFoodItems();
    }

    // ✅ Get food items by category
    @GetMapping("/foodcategory")
    public ResponseEntity<List<Food>> getFoodItemsByCategory(@RequestParam Long categoryId) {
        List<Food> foodItems= foodService.findByCategory(categoryId);
        //return foodService.getFoodItemsByCategory(categoryId);
        return ResponseEntity.ok(foodItems);
    }

//    @GetMapping("/api/food-items?categoryId=<categoryId>")
//    public List<Food> getFoodItemsByCategory(@PathVariable Long categoryId) {
//        return foodService.getFoodItemsByCategory(categoryId);
//    }

   /* public String getFoodList(Model model) {
        List<Food> foods = foodService.getAllFoodItems();
        List<Category> categories = categoryService.getAllCategories();
        model.addAttribute("foods", foods);
        model.addAttribute("categories", categories);
        return "food_list";  // food_list.html (view)
    }*/
}
