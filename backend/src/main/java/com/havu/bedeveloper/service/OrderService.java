package com.havu.bedeveloper.service;

import com.havu.bedeveloper.domain.request.AddOrderRequest;
import com.havu.bedeveloper.entity.CartItem;
import com.havu.bedeveloper.entity.Order;
import com.havu.bedeveloper.entity.OrderItem;
import com.havu.bedeveloper.entity.User;
import com.havu.bedeveloper.enumeration.OrderStatus;
import com.havu.bedeveloper.exception.domain.CartItemNotFoundException;
import com.havu.bedeveloper.exception.domain.OrderNotFoundException;
import com.havu.bedeveloper.exception.domain.UserNotFoundException;
import com.havu.bedeveloper.repository.CartItemRepository;
import com.havu.bedeveloper.repository.OrderRepository;
import com.havu.bedeveloper.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.havu.bedeveloper.enumeration.OrderStatus.*;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final CartItemRepository cartItemRepo;

    //
    public Order getById(int id) throws OrderNotFoundException {
        return this.orderRepo.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Không tìm thấy đơn hàng với ID: " + id));
    }

    //
    public List<Order> getByUserId(int userId)
           throws UserNotFoundException {
        User user = this.userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng với ID: " + userId));
        return this.orderRepo.findAllByUserOrderByIdDesc(user);
    }

    //
    public List<Order> getAllOrders() {
        return this.orderRepo.findAll();
    }

    //
    public Order updateOrderStatus(int orderId,
                                   String status) throws OrderNotFoundException {
        Order order = this.orderRepo.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));
        OrderStatus orderStatus = OrderStatus.valueOf(status);
        order.setOrderStatus(orderStatus);
        return this.orderRepo.save(order);
    }

    //
    public Order addNewOrder(AddOrderRequest request)
           throws UserNotFoundException, CartItemNotFoundException {
        Order order = new Order();

        order.setOrderCode(generateOrderCode());
        order.setOrderTime(LocalDateTime.now());
        order.setAddress(request.getAddress());
        order.setPhone(request.getPhone());
        order.setOrderStatus(ORDERED);

        User userById = this.userRepo.findById(request.getUserId())
                .orElseThrow(() -> new UserNotFoundException("Người dùng không tồn tại"));
        order.setUser(userById);

        double realAmount = 0;
        double checkoutAmount = 0;
        for(Integer cartItemId : request.getCartItemIds()) {
            CartItem cartItem = this.cartItemRepo.findById(cartItemId)
                    .orElseThrow(() -> new CartItemNotFoundException("Cart item not found with ID: " + cartItemId));
            OrderItem orderItem = new OrderItem();
            realAmount += cartItem.getProduct().getPrice() * cartItem.getQuantity();
            checkoutAmount += cartItem.getPrice();

            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setProduct(cartItem.getProduct());

            order.addOrderItem(orderItem);
        }

        // delete cart item
        for(Integer cartItemId : request.getCartItemIds()) {
            this.cartItemRepo.deleteById(cartItemId);
        }

        order.setRealAmount(realAmount);
        order.setCheckoutAmount(checkoutAmount);

        return this.orderRepo.save(order);
    }

    //
    public Order cancelOrder(int id)
           throws OrderNotFoundException {
        Order order = this.orderRepo.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Không thể tìm thấy đơn hàng với ID: " + id));
        order.setOrderStatus(CANCEL);
        return this.orderRepo.save(order);
    }

    // private functions
    // 1
    private String generateOrderCode() {
        return RandomStringUtils.randomAlphanumeric(10);
    }
}
