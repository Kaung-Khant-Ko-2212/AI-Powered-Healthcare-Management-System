package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.model.Category;
import com.ezhealthcare.EZHealthcare.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}

