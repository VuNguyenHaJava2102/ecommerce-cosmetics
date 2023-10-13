package com.havu.bedeveloper.resource;

import com.havu.bedeveloper.entity.Rating;
import com.havu.bedeveloper.exception.domain.ProductNotFoundException;
import com.havu.bedeveloper.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/rating")
@RequiredArgsConstructor
public class RatingResource {

    private final RatingService service;

    // 1
    @GetMapping("/get-all")
    public ResponseEntity<List<Rating>> getAllOrderById() {
        List<Rating> ratings = this.service.getAllOrderById();
        return new ResponseEntity<>(ratings, OK);
    }

    // 2
    @GetMapping("/get-by-product/{productId}")
    public ResponseEntity<List<Rating>> getAllByProduct(@PathVariable("productId") int productId)
           throws ProductNotFoundException {
        List<Rating> ratings = this.service.getAllByProduct(productId);
        return new ResponseEntity<>(ratings, OK);
    }
}
