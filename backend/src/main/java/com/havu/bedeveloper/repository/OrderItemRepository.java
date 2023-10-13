package com.havu.bedeveloper.repository;

import com.havu.bedeveloper.entity.Order;
import com.havu.bedeveloper.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findAllByOrder(Order order);
}
