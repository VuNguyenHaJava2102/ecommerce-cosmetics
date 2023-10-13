package com.havu.bedeveloper.repository;

import com.havu.bedeveloper.entity.Product;
import com.havu.bedeveloper.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Integer> {

    List<Rating> findAllByOrderByIdDesc();

    List<Rating> findAllByProduct(Product product);
}
