package com.havu.bedeveloper.repository;

import com.havu.bedeveloper.entity.CartItem;
import com.havu.bedeveloper.entity.Product;
import com.havu.bedeveloper.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    int countByProductId(int productId);

    CartItem findByUserAndProduct(User user, Product product);

    List<CartItem> findByUserId(int userId);
}
