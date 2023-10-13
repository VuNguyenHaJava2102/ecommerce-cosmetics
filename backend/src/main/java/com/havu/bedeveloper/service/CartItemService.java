package com.havu.bedeveloper.service;

import com.havu.bedeveloper.domain.request.AddCartItemRequest;
import com.havu.bedeveloper.entity.CartItem;
import com.havu.bedeveloper.entity.Product;
import com.havu.bedeveloper.entity.User;
import com.havu.bedeveloper.repository.CartItemRepository;
import com.havu.bedeveloper.repository.ProductRepository;
import com.havu.bedeveloper.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartItemService {

    private final CartItemRepository cartItemRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    // 1
    public List<CartItem> getByUserId(int userId) {
        return this.cartItemRepo.findByUserId(userId);
    }

    // 2
    public CartItem addNew(AddCartItemRequest request)
           throws Exception {
        Product product = this.productRepo.findById(request.getProductId()).orElse(null);
        User user = this.userRepo.findById(request.getUserId()).orElse(null);
        if(product == null || user == null) {
            throw new Exception();
        }
        // case: add cartItem that already exists in cart
        CartItem cartItemByUserAndProduct = this.cartItemRepo.findByUserAndProduct(user, product);
        if(cartItemByUserAndProduct != null) {
            cartItemByUserAndProduct.setQuantity(cartItemByUserAndProduct.getQuantity() + 1);
            return this.cartItemRepo.save(cartItemByUserAndProduct);
        }

        CartItem cartItem = new CartItem(request.getId(), request.getQuantity(), request.getPrice(), product, user);
        return this.cartItemRepo.save(cartItem);
    }

    // 3
    public void deleteById(int id) {
        if(this.cartItemRepo.existsById(id)) {
            this.cartItemRepo.deleteById(id);
        }
    }

    // 4
    public CartItem updateCartItemQuantity(int itemId, int quantity)
           throws Exception {
        CartItem cartItem = this.cartItemRepo.findById(itemId).orElse(null);
        if(cartItem == null) {
            throw new Exception();
        }

        double unitPrice = cartItem.getPrice() / cartItem.getQuantity();
        cartItem.setQuantity(quantity);
        cartItem.setPrice(unitPrice * quantity);
        return this.cartItemRepo.save(cartItem);
    }
}
