package com.havu.bedeveloper.resource;

import com.havu.bedeveloper.domain.request.AddCartItemRequest;
import com.havu.bedeveloper.entity.CartItem;
import com.havu.bedeveloper.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/cart-item")
@RequiredArgsConstructor
public class CartItemResource {

    private final CartItemService service;

    // 1 *
    @GetMapping("/get-by-user/{userId}")
    public ResponseEntity<List<CartItem>> getByUserId(@PathVariable("userId") int userId) {
        List<CartItem> items = this.service.getByUserId(userId);
        return new ResponseEntity<>(items, OK);
    }

    // 2
    @PostMapping("/add")
    public ResponseEntity<CartItem> addNewCartItem(@RequestBody AddCartItemRequest request)
           throws Exception {
        return new ResponseEntity<>(this.service.addNew(request), CREATED);
    }

    // 3 *
    @PutMapping("/update-quantity/{itemId}/{quantity}")
    public ResponseEntity<CartItem> updateCartItemQuantity(@PathVariable("itemId") int itemId,
                                                           @PathVariable("quantity") int quantity)
           throws Exception {
        return new ResponseEntity<>(this.service.updateCartItemQuantity(itemId, quantity), OK);
    }

    // 4 *
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") int id) {
        this.service.deleteById(id);
        return new ResponseEntity<>(OK);
    }

}
