package com.havu.bedeveloper;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

import static com.havu.bedeveloper.constant.FileConstant.PRODUCT_FOLDER;
import static com.havu.bedeveloper.constant.FileConstant.USER_FOLDER;

@SpringBootApplication
public class BeAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(BeAppApplication.class, args);

        // create directory for profile images
        new File(USER_FOLDER).mkdirs();
        new File(PRODUCT_FOLDER).mkdirs();
    }
}
