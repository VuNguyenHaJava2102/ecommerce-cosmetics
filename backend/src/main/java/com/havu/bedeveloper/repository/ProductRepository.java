package com.havu.bedeveloper.repository;

import com.havu.bedeveloper.entity.Category;
import com.havu.bedeveloper.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    Product findByName(String name);

    Product findByProductCode(String code);

    List<Product> findByActiveTrue();

    List<Product> findByActiveTrueOrderBySoldDesc();

    List<Product> findTop10ByOrderBySoldDesc();

    List<Product> findByActiveTrueOrderByEnteredDateDesc();

    List<Product> findByCategory(Category category);

    List<Product> findByActiveTrueOrderByQuantityDesc();

    @Query(value = """
                   SELECT p.*
                   FROM product AS p
                   LEFT JOIN rating AS r ON p.id = r.product_id
                   GROUP BY p.id
                   ORDER BY AVG(r.rating_point) DESC
                   """, nativeQuery = true)
    List<Product> findRatedProductsOrderByAvgRatingDesc();

    @Query(value = """
                   SELECT p.*
                   FROM product AS p
                   WHERE p.category_id = :categoryId
                   AND p.id <> :productId
                   """, nativeQuery = true)
    List<Product> findRelatedProducts(@Param("categoryId") int categoryId,
                                      @Param("productId") int productId);
}
