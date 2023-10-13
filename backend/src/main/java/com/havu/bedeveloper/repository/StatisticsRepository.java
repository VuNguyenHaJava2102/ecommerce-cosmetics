package com.havu.bedeveloper.repository;

import com.havu.bedeveloper.domain.response.Statistics;
import com.havu.bedeveloper.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StatisticsRepository extends JpaRepository<Product, Integer> {

    @Query(value = """
                   SELECT sum(checkout_amount)
                   FROM orders
                   WHERE YEAR(order_time) = YEAR(CURRENT_DATE())
                   AND order_status = 'DELIVERED'
                   """, nativeQuery = true)
    Double getRevenueOfCurrentYear();

    @Query(value = """
                   SELECT sum(checkout_amount)
                   FROM orders
                   WHERE YEAR(order_time) = YEAR(CURRENT_DATE())
                   AND MONTH(order_time) = MONTH(CURRENT_DATE())
                   AND order_status = 'DELIVERED'
                   """, nativeQuery = true)
    Double getRevenueOfCurrentMonth();

    @Query(value = """
                   SELECT YEAR(order_time)
                   FROM orders
                   GROUP BY YEAR(order_time)
                   """, nativeQuery = true)
    List<Integer> getAllYears();

    @Query(value = """
                   SELECT MONTH(order_time) AS monthOfYear, SUM(checkout_amount) AS totalRevenue, COUNT(*) AS totalOrder
                   FROM orders
                   WHERE year(order_time) = :year
                   AND order_status = 'DELIVERED'
                   GROUP BY MONTH(order_time)
                   """, nativeQuery = true)
    List<Statistics> getRevenueOfMonthsByYear(@Param("year") int year);

}
