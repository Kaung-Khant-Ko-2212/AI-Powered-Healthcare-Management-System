package com.ezhealthcare.EZHealthcare.repository;

import com.ezhealthcare.EZHealthcare.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {

    @Query("SELECT f FROM Food f WHERE f.category.id = :categoryId")
    List<Food> findByCategoryId(@Param("categoryId") Long categoryId);
}
