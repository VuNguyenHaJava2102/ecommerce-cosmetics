package com.havu.bedeveloper.helper;

import com.havu.bedeveloper.entity.User;
import com.havu.bedeveloper.exception.domain.EmailExistException;
import com.havu.bedeveloper.exception.domain.NotAnImageException;
import com.havu.bedeveloper.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
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
public class UserServiceHelper {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;

    // public functions
    // 1
    public String encodePassword(String rawPassword) {
        return this.passwordEncoder.encode(rawPassword);
    }

    // 2
    public String getDefaultImageUrl() {
        // http://localhost:8080/user/image/default
        return ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path(DEFAULT_USER_IMAGE_PATH)
                .toUriString();
    }

    // 3
    public User saveUserImage(User user, MultipartFile imageFile)
           throws IOException {
        if(imageFile != null) {
            // /C/Users/T490/best-project/user-image/(email)/(email.extension)
            String username = user.getEmail();
            Path imageFolder = Paths.get(USER_FOLDER + username)
                                   .toAbsolutePath().normalize();
            if(!Files.exists(imageFolder)) {
                Files.createDirectory(imageFolder);
            }
            Files.deleteIfExists(Paths.get(imageFolder + username + ".jpg"));
            Files.copy(imageFile.getInputStream(),
                    imageFolder.resolve(username + ".jpg"),
                    StandardCopyOption.REPLACE_EXISTING);

            user.setImageUrl(setProfileImageUrl(username));
            return this.repository.save(user);
        }
        return user;
    }

    // 4
    public void deleteImageFolder(String email) throws IOException {
        Path imagePath = Paths.get(USER_FOLDER + email + "/" + email + ".jpg");
        Files.deleteIfExists(imagePath);

        Path folderPath = Paths.get(USER_FOLDER + email);
        Files.deleteIfExists(folderPath);
    }

    // 5
    public User checkEmailExistence(int id, String email) throws EmailExistException {
        User userByNewEmail = this.repository.findUserByEmail(email);

        if(id != 0) { // case: update
            if(userByNewEmail != null && userByNewEmail.getId() != id) {
                throw new EmailExistException("Email already exists with email: " + email);
            }
            return this.repository.findById(id).get();
        } else { // case: add new
            if(userByNewEmail != null) {
                throw new EmailExistException("Email already exists with email: " + email);
            }
            return null;
        }
    }

    // private functions
    // 1
    private String setProfileImageUrl(String email) {
        // http://localhost:8080/user/image/(email)/(email.extension)
        return ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path(USER_IMAGE_PATH + email + "/" + email + ".jpg")
                .toUriString();
    }
}
