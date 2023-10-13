package com.havu.bedeveloper.service;

import com.havu.bedeveloper.entity.Product;
import com.havu.bedeveloper.entity.Rating;
import com.havu.bedeveloper.exception.domain.ProductNotFoundException;
import com.havu.bedeveloper.repository.ProductRepository;
import com.havu.bedeveloper.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepo;
    private final ProductRepository productRepo;

    // 1
    public List<Rating> getAllOrderById() {
        return this.ratingRepo.findAllByOrderByIdDesc();
    }

    // 2
    public List<Rating> getAllByProduct(int productId)
           throws ProductNotFoundException {
        Product product = this.productRepo.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Không tìm thấy sản phẩm"));
        return this.ratingRepo.findAllByProduct(product);
    }
}
