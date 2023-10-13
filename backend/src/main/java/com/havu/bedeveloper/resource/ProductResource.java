package com.havu.bedeveloper.resource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.havu.bedeveloper.domain.request.AddUpdateProductRequest;
import com.havu.bedeveloper.entity.Product;
import com.havu.bedeveloper.exception.domain.CategoryNotFoundException;
import com.havu.bedeveloper.exception.domain.NotAnImageException;
import com.havu.bedeveloper.exception.domain.ProductNameExistException;
import com.havu.bedeveloper.exception.domain.ProductNotFoundException;
import com.havu.bedeveloper.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
public class ProductResource {

    private final ProductService service;
    private final ObjectMapper objectMapper;

    // 1
    @GetMapping("/all-active")
    public ResponseEntity<List<Product>> getAllActiveProducts() {
        List<Product> products = this.service.getAllActiveProducts();
        return new ResponseEntity<>(products, OK);
    }

    // 2
    @GetMapping("/best-seller")
    public ResponseEntity<List<Product>> getBestSellerProduct() {
        List<Product> products = this.service.getAllActiveProductsOrderBySoldDesc();
        return new ResponseEntity<>(products, OK);
    }

    //
    @GetMapping("/top10-best-seller")
    public ResponseEntity<List<Product>> getTop10BestSellerProduct() {
        List<Product> products = this.service.getTop10BestSeller();
        return new ResponseEntity<>(products, OK);
    }

    // 3
    @GetMapping("/newest")
    public ResponseEntity<List<Product>> getNewestProduct() {
        List<Product> products = this.service.getAllNewestActiveProducts();
        return new ResponseEntity<>(products, OK);
    }

    // 4
    @GetMapping("/best-rating")
    public ResponseEntity<List<Product>> getBestRatingProducts() {
        List<Product> products = this.service.getProductsOrderByAvgRatingDesc();
        return new ResponseEntity<>(products, OK);
    }

    // 5
    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<Product> getById(@PathVariable("id") int id)
           throws ProductNotFoundException {
        return new ResponseEntity<>(this.service.getById(id), OK);
    }

    // 6
    @GetMapping("/get-by-category/{categoryId}")
    public ResponseEntity<List<Product>> getAllByCategory(@PathVariable("categoryId") int categoryId)
           throws CategoryNotFoundException {
        return new ResponseEntity<>(this.service.getAllByCategory(categoryId), OK);
    }

    //
    @GetMapping("/get-related/{categoryId}/{productId}")
    public ResponseEntity<List<Product>> getRelatedProducts(@PathVariable("categoryId") int categoryId,
                                                            @PathVariable("productId") int productId) {
        return new ResponseEntity<>(this.service.getRelatedProduct(categoryId, productId), OK);
    }

    // 7 *
    @PostMapping("/add")
    public ResponseEntity<Product> addNewProduct(@RequestParam("request") String requestStr,
                                                 @RequestParam(value = "imageFile", required = false) MultipartFile imageFile)
           throws IOException, ProductNameExistException, NotAnImageException, CategoryNotFoundException {
        AddUpdateProductRequest request = this.objectMapper.readValue(requestStr, AddUpdateProductRequest.class);
        Product saved = this.service.addNewProduct(request, imageFile);
        return new ResponseEntity<>(saved, CREATED);
    }

    // 8 *
    @PutMapping("/update")
    public ResponseEntity<Product> update(@RequestParam("request") String requestStr,
                                          @RequestParam(value = "imageFile", required = false) MultipartFile imageFile)
           throws IOException, ProductNameExistException, NotAnImageException, CategoryNotFoundException {
        AddUpdateProductRequest request = this.objectMapper.readValue(requestStr, AddUpdateProductRequest.class);
        System.out.println(request);
        Product saved = this.service.updateProduct(request, imageFile);
        return new ResponseEntity<>(saved, OK);
    }

    // 9 *
    @DeleteMapping("/delete/{code}")
    public ResponseEntity<?> deleteProduct(@PathVariable("code") String code)
           throws Exception {
        this.service.deleteProductByCode(code);
        return new ResponseEntity<>(OK);
    }
}
