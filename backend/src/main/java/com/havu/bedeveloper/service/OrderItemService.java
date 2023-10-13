package com.havu.bedeveloper.service;

import com.havu.bedeveloper.entity.Order;
import com.havu.bedeveloper.entity.OrderItem;
import com.havu.bedeveloper.exception.domain.OrderNotFoundException;
import com.havu.bedeveloper.repository.OrderItemRepository;
import com.havu.bedeveloper.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;

    //
    public List<OrderItem> getByOrderId(int orderId)
           throws OrderNotFoundException {
        Order order = this.orderRepo.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));
        return this.orderItemRepo.findAllByOrder(order);
    }
}
