package com.havu.bedeveloper.resource;

import com.havu.bedeveloper.entity.FavouriteItem;
import com.havu.bedeveloper.exception.domain.ProductNotFoundException;
import com.havu.bedeveloper.service.FavouriteItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/favourite-item")
@RequiredArgsConstructor
public class FavouriteItemResource {

    private final FavouriteItemService service;

    // 1
    @GetMapping("/count-by-user/{userId}")
    public ResponseEntity<Integer> countItemsByUserId(@PathVariable("userId") int userId) {
        int result = this.service.countItemsByUserId(userId);
        return new ResponseEntity<>(result, OK);
    }

    // 2 *
    @GetMapping("/get-by-user/{userId}")
    public ResponseEntity<List<FavouriteItem>> getByUser(@PathVariable("userId") int userId) {
        List<FavouriteItem> items = this.service.getByUserId(userId);
        return new ResponseEntity<>(items, OK);
    }

    // 3
    @GetMapping("/count-by-product/{productId}")
    public ResponseEntity<Integer> countByProduct(@PathVariable("productId") int productId)
           throws ProductNotFoundException {
        int result = this.service.countByProduct(productId);
        return new ResponseEntity<>(result, OK);
    }

    // 4 *
    @GetMapping("/get/{userId}/{productId}")
    public ResponseEntity<FavouriteItem> getByUserAndProduct(@PathVariable("userId") int userId,
                                                             @PathVariable("productId") int productId)
           throws Exception {
        return new ResponseEntity<>(this.service.getByUserAndProduct(userId, productId), OK);
    }

    // 5 *
    @PostMapping("/add/{userId}/{productId}")
    public ResponseEntity<FavouriteItem> addNewFavouriteItem(@PathVariable("userId") int userId,
                                                             @PathVariable("productId") int productId)
           throws Exception {
        return new ResponseEntity<>(this.service.saveByUserAndProduct(userId, productId), CREATED);
    }

    // 6 *
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") int id) {
        this.service.deleteById(id);
        return new ResponseEntity<>(OK);
    }
}
