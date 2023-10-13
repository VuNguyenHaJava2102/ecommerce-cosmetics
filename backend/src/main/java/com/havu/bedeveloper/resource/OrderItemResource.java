package com.havu.bedeveloper.resource;

import com.havu.bedeveloper.entity.OrderItem;
import com.havu.bedeveloper.exception.domain.OrderNotFoundException;
import com.havu.bedeveloper.service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/order-item")
@RequiredArgsConstructor
public class OrderItemResource {

    private final OrderItemService service;

    // 1 *
    @GetMapping("/get-by-order/{orderId}")
    public ResponseEntity<List<OrderItem>> getAllByOrderId(@PathVariable("orderId") int orderId)
           throws OrderNotFoundException {
        return new ResponseEntity<>(this.service.getByOrderId(orderId), OK);
    }

}
