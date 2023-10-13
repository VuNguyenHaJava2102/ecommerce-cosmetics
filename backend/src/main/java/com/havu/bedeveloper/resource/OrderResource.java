package com.havu.bedeveloper.resource;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.havu.bedeveloper.domain.request.AddOrderRequest;
import com.havu.bedeveloper.entity.Order;
import com.havu.bedeveloper.exception.domain.CartItemNotFoundException;
import com.havu.bedeveloper.exception.domain.OrderNotFoundException;
import com.havu.bedeveloper.exception.domain.UserNotFoundException;
import com.havu.bedeveloper.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderResource {

    private final OrderService service;
    private final ObjectMapper objectMapper;

    // 1
    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<Order> getById(@PathVariable("id") int id)
           throws OrderNotFoundException {
        return new ResponseEntity<>(this.service.getById(id), OK);
    }

    // 2
    @GetMapping("/get-by-user-id/{userId}")
    public ResponseEntity<List<Order>> getByUserId(@PathVariable("userId") int userId)
           throws UserNotFoundException {
        return new ResponseEntity<>(this.service.getByUserId(userId), OK);
    }

    //
    @GetMapping("/get-all")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = this.service.getAllOrders();
        return new ResponseEntity<>(orders, OK);
    }

    //
    @GetMapping("/update-status/{id}/{status}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable("id") int orderId,
                                                   @PathVariable("status") String status)
           throws OrderNotFoundException {
        Order order = this.service.updateOrderStatus(orderId, status);
        return new ResponseEntity<>(order, OK);
    }

    //
    @PostMapping("/add")
    public ResponseEntity<Order> addOrder(@RequestParam("request") String requestStr)
           throws UserNotFoundException, CartItemNotFoundException, JsonProcessingException {
        AddOrderRequest request = this.objectMapper.readValue(requestStr, AddOrderRequest.class);
        return new ResponseEntity<>(this.service.addNewOrder(request), CREATED);
    }

    //
    @PutMapping("/cancel/{id}")
    public ResponseEntity<Order> cancelOrder(@PathVariable("id") int id)
           throws OrderNotFoundException {
        return new ResponseEntity<>(this.service.cancelOrder(id), OK);
    }
}
