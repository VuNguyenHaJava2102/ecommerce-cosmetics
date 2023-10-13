package com.havu.bedeveloper.service;

import com.havu.bedeveloper.domain.request.AddUpdateProductRequest;
import com.havu.bedeveloper.entity.Category;
import com.havu.bedeveloper.entity.Product;
import com.havu.bedeveloper.exception.domain.CategoryNotFoundException;
import com.havu.bedeveloper.exception.domain.NotAnImageException;
import com.havu.bedeveloper.exception.domain.ProductNameExistException;
import com.havu.bedeveloper.exception.domain.ProductNotFoundException;
import com.havu.bedeveloper.helper.ProductServiceHelper;
import com.havu.bedeveloper.repository.CartItemRepository;
import com.havu.bedeveloper.repository.CategoryRepository;
import com.havu.bedeveloper.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final CartItemRepository cartItemRepo;
    private final ProductServiceHelper helper;

    // 1
    public List<Product> getAllActiveProducts() {
        return this.productRepo.findByActiveTrue();
    }

    // 2
    public List<Product> getAllActiveProductsOrderBySoldDesc() {
        return this.productRepo.findByActiveTrueOrderBySoldDesc();
    }

    public List<Product> getTop10BestSeller() {
        return this.productRepo.findTop10ByOrderBySoldDesc();
    }

    // 3
    public List<Product> getAllNewestActiveProducts() {
        return this.productRepo.findByActiveTrueOrderByEnteredDateDesc();
    }

    // 4
    public List<Product> getProductsOrderByAvgRatingDesc() {
        return this.productRepo.findRatedProductsOrderByAvgRatingDesc();
    }

    // 5
    public List<Product> getAllByCategory(int categoryId)
            throws CategoryNotFoundException {
        Category category = this.categoryRepo.findById(categoryId).orElse(null);
        if(category == null) {
            throw new CategoryNotFoundException("Loại sản phẩm không tồn tại");
        }
        return this.productRepo.findByCategory(category);
    }

    // 6
    public List<Product> getRelatedProduct(int categoryId, int productId) {
        return this.productRepo.findRelatedProducts(categoryId, productId);
    }

    //
    public List<Product> getProductsByQuantityDesc() {
        return this.productRepo.findByActiveTrueOrderByQuantityDesc();
    }

    // 7
    public Product getById(int id) throws ProductNotFoundException {
        return this.productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Không tìm thấy sản phẩm"));
    }

    // 8
    public Product addNewProduct(AddUpdateProductRequest request, MultipartFile imageFile)
           throws ProductNameExistException, IOException, NotAnImageException, CategoryNotFoundException {
        this.helper.checkProductNameExistence(0, request.getName());
        Product product = new Product();

        product.setProductCode(this.helper.getRandomProductCode());
        product.setName(request.getName());
        product.setQuantity(request.getQuantity());
        product.setPrice(request.getPrice());
        product.setDiscount(request.getDiscount());

        String defaultImage = this.helper.getDefaultImageUrl();
        product.setImageUrl(defaultImage);
        product.setDescription(request.getDescription());
        product.setEnteredDate(LocalDate.now());
        product.setActive(true);
        product.setSold(0);

        Category categoryById = this.categoryRepo.findById(request.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Không thể tìm thấy loại sản phẩm với ID: " + request.getCategoryId()));
        product.setCategory(categoryById);

        if(imageFile != null) {
            this.helper.saveProductImage(product, imageFile);
        }
        return this.productRepo.save(product);
    }

    // 9
    public void deleteProductByCode(String code) throws Exception {
        Product productByCode = this.productRepo.findByProductCode(code);
        int countProductById = this.cartItemRepo.countByProductId(productByCode.getId());

        if(countProductById > 0) {
            throw new Exception();
        } else {
            this.productRepo.delete(productByCode);
            this.helper.deleteImageFolder(code);
        }
    }

    // 10
    public Product updateProduct(AddUpdateProductRequest request, MultipartFile imageFile)
            throws ProductNameExistException, IOException, NotAnImageException, CategoryNotFoundException {
        Product product = this.helper.checkProductNameExistence(request.getId(), request.getName());

        product.setName(request.getName());
        product.setQuantity(request.getQuantity());
        product.setPrice(request.getPrice());
        product.setDiscount(request.getDiscount());
        product.setDescription(request.getDescription());
        product.setActive(request.isActive());
        product.setSold(request.getSold());

        Category categoryById = this.categoryRepo.findById(request.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Không thể tìm thấy loại sản phẩm với ID: " + request.getCategoryId()));
        product.setCategory(categoryById);

        if(imageFile != null) {
            this.helper.saveProductImage(product, imageFile);
        }
        return this.productRepo.save(product);
    }
}
