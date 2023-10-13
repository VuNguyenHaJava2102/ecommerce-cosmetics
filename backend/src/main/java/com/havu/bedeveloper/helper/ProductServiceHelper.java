package com.havu.bedeveloper.helper;

import com.havu.bedeveloper.entity.Product;
import com.havu.bedeveloper.exception.domain.NotAnImageException;
import com.havu.bedeveloper.exception.domain.ProductNameExistException;
import com.havu.bedeveloper.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;

import static com.havu.bedeveloper.constant.FileConstant.*;

@Component
@RequiredArgsConstructor
public class ProductServiceHelper {

    private final ProductRepository repository;

    // public functions
    // 1
    public Product checkProductNameExistence(int id, String name)
           throws ProductNameExistException {
        Product productByName = this.repository.findByName(name);

        if(id != 0) { // case: update
            if(productByName != null && productByName.getId() != id) {
                throw new ProductNameExistException("Sản phẩm với tên: " + name + " đã tồn tại.");
            }
            return this.repository.findById(id).get();
        } else { // case: add
            if(productByName != null) {
                throw new ProductNameExistException("Sản phẩm với tên: " + name + " đã tồn tại.");
            }
            return null;
        }
    }

    // 2
    public String getDefaultImageUrl() {
        // http://localhost:8080/product/image/default
        return ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path(DEFAULT_PRODUCT_IMAGE_PATH)
                .toUriString();
    }

    // 3
    public String getRandomProductCode() {
        return RandomStringUtils.randomAlphanumeric(10);
    }

    // 4
    public Product saveProductImage(Product product, MultipartFile imageFile)
            throws IOException, NotAnImageException {
        List<String> allowedImageTypes = Arrays.asList(MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_GIF_VALUE, MediaType.IMAGE_PNG_VALUE);
        if(imageFile != null) {
            if(!allowedImageTypes.contains(imageFile.getContentType())) {
                throw new NotAnImageException(imageFile.getOriginalFilename() + " không phải là file ảnh.");
            }

            // /C/Users/T490/best-project/product-image/(productCode)/(productCode.extension)
            String productCode = product.getProductCode();
            Path imageFolder = Paths.get(PRODUCT_FOLDER + productCode)
                    .toAbsolutePath().normalize();
            if(!Files.exists(imageFolder)) {
                Files.createDirectory(imageFolder);
            }
            Files.deleteIfExists(Paths.get(imageFolder + productCode + ".jpg"));
            Files.copy(imageFile.getInputStream(),
                    imageFolder.resolve(productCode + ".jpg"),
                    StandardCopyOption.REPLACE_EXISTING);

            product.setImageUrl(setProfileImageUrl(productCode));
            return this.repository.save(product);
        }
        return product;
    }

    // 5
    public void deleteImageFolder(String code) throws IOException {
        Path imagePath = Paths.get(PRODUCT_FOLDER + code + "/" + code + ".jpg");
        Files.deleteIfExists(imagePath);

        Path folderPath = Paths.get(PRODUCT_FOLDER + code);
        Files.deleteIfExists(folderPath);
    }

    // private functions
    // 1
    private String setProfileImageUrl(String productCode) {
        // http://localhost:8080/product/image/(productCode)/(productCode.extension)
        return ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path(PRODUCT_IMAGE_PATH + productCode + "/" + productCode + ".jpg")
                .toUriString();
    }
}
