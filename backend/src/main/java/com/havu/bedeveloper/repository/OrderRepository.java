package com.havu.bedeveloper.repository;

import com.havu.bedeveloper.entity.Order;
import com.havu.bedeveloper.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findAllByUserOrderByIdDesc(User user);
}
