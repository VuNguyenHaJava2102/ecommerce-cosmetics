package com.havu.bedeveloper.service;

import com.havu.bedeveloper.entity.FavouriteItem;
import com.havu.bedeveloper.entity.Product;
import com.havu.bedeveloper.entity.User;
import com.havu.bedeveloper.exception.domain.ProductNotFoundException;
import com.havu.bedeveloper.repository.FavouriteItemRepository;
import com.havu.bedeveloper.repository.ProductRepository;
import com.havu.bedeveloper.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavouriteItemService {

    private final FavouriteItemRepository favouriteItemRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    // 1
    public int countItemsByUserId(int userId) {
        return this.favouriteItemRepo.countByUserId(userId);
    }

    // 2
    public List<FavouriteItem> getByUserId(int userId) {
        return this.favouriteItemRepo.findByUserId(userId);
    }

    public int countByProduct(int productId)
           throws ProductNotFoundException {
        Product product = this.productRepo.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Không thể tìm thấy sản phẩm"));
        return this.favouriteItemRepo.countByProduct(product);
    }

    // 3
    public FavouriteItem getByUserAndProduct(int userId, int productId)
           throws Exception {
        User user = this.userRepo.findById(userId).orElse(null);
        Product product = this.productRepo.findById(productId).orElse(null);
        if(user == null || product == null) {
            throw new Exception();
        }
        return this.favouriteItemRepo.findByUserAndProduct(user, product);
    }

    // 4
    public FavouriteItem saveByUserAndProduct(int userId, int productId)
           throws Exception {
        User user = this.userRepo.findById(userId).orElse(null);
        Product product = this.productRepo.findById(productId).orElse(null);
        if(user == null || product == null) {
            throw new Exception();
        }
        FavouriteItem item = new FavouriteItem(user, product);
        return this.favouriteItemRepo.save(item);
    }

    // 5
    public void deleteById(int id) {
        if(this.favouriteItemRepo.existsById(id)) {
            this.favouriteItemRepo.deleteById(id);
        }
    }
}
