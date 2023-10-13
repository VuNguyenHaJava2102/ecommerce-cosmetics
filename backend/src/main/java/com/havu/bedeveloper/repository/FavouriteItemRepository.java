package com.havu.bedeveloper.repository;

import com.havu.bedeveloper.entity.FavouriteItem;
import com.havu.bedeveloper.entity.Product;
import com.havu.bedeveloper.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavouriteItemRepository extends JpaRepository<FavouriteItem, Integer> {

    int countByUserId(int userId);

    int countByProduct(Product product);

    FavouriteItem findByUserAndProduct(User user, Product product);

    List<FavouriteItem> findByUserId(int userId);

}
