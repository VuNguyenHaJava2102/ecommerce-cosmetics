package com.havu.bedeveloper.resource;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import static com.havu.bedeveloper.constant.FileConstant.PRODUCT_FOLDER;
import static com.havu.bedeveloper.constant.FileConstant.USER_FOLDER;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;

@RestController
public class ImageResource {

    // 1
    @GetMapping(value = "/user/image/{email}/{fileName}", produces = IMAGE_JPEG_VALUE)
    public byte[] getUserImageInFolder(@PathVariable("email") String email,
                                       @PathVariable("fileName") String fileName)
           throws IOException {
        return Files.readAllBytes(Paths.get(USER_FOLDER + email + "/" + fileName));
    }

    // 2
    @GetMapping(value = "/user/image/default", produces = IMAGE_JPEG_VALUE)
    public byte[] getDefaultUserImage()
           throws IOException {
        return Files.readAllBytes(Paths.get(USER_FOLDER + "default-image.jpg"));
    }

    // 3
    @GetMapping(value = "/product/image/{code}/{fileName}", produces = IMAGE_JPEG_VALUE)
    public byte[] getProductImageInFolder(@PathVariable("code") String code,
                                          @PathVariable("fileName") String fileName)
           throws IOException {
        return Files.readAllBytes(Paths.get(PRODUCT_FOLDER + code + "/" + fileName));
    }

    // 4
    @GetMapping(value = "/product/image/default", produces = IMAGE_JPEG_VALUE)
    public byte[] getDefaultProductImage()
           throws IOException {
        return Files.readAllBytes(Paths.get(PRODUCT_FOLDER + "default-image.jpg"));
    }
}
