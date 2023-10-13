package com.havu.bedeveloper.service;

import com.havu.bedeveloper.domain.request.AddCustomerRequest;
import com.havu.bedeveloper.security.CustomUserDetails;
import com.havu.bedeveloper.domain.request.RegisterRequest;
import com.havu.bedeveloper.domain.request.UpdateCustomerRequest;
import com.havu.bedeveloper.entity.User;
import com.havu.bedeveloper.exception.domain.EmailExistException;
import com.havu.bedeveloper.exception.domain.EmailNotFoundException;
import com.havu.bedeveloper.exception.domain.NotAnImageException;
import com.havu.bedeveloper.exception.domain.UserNotFoundException;
import com.havu.bedeveloper.helper.UserServiceHelper;
import com.havu.bedeveloper.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import static com.havu.bedeveloper.enumeration.Role.*;
import static com.havu.bedeveloper.enumeration.Gender.*;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository repository;
    private final UserServiceHelper helper;

    // public functions
    // 1
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User userByEmail = this.repository.findUserByEmail(email);
        if(userByEmail == null) {
            throw new UsernameNotFoundException("User not found by email: " + email);
        }
        return new CustomUserDetails(userByEmail);
    }

    // 2
    public User getUserByEmail(String email) throws EmailNotFoundException {
        User user = this.repository.findUserByEmail(email);
        if(user == null) {
            throw new EmailNotFoundException("User not found by email: " + email);
        }
        return user;
    }

    // 3
    public User registerUserAsCustomer(RegisterRequest request) throws EmailExistException {
        this.helper.checkEmailExistence(0, request.getEmail());
        User customer = new User();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());

        String encodedPassword = this.helper.encodePassword(request.getPassword());
        customer.setPassword(encodedPassword);
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        customer.setGender(request.isGender() ? MALE : FEMALE);

        String defaultImageUrl = this.helper.getDefaultImageUrl();
        customer.setImageUrl(defaultImageUrl);
        customer.setRegisterDate(LocalDate.now());
        customer.setActive(true);
        customer.setNotLocked(true);
        customer.setRole(ROLE_CUSTOMER.name());
        customer.setAuthorities(ROLE_CUSTOMER.getAuthority());

        return this.repository.save(customer);
    }

    // users as customers
    // 1
    public List<User> getAllUsersAsCustomers() {
        return this.repository.findByRole("ROLE_CUSTOMER");
    }

    // 2
    public User addNewUserAsCustomer(AddCustomerRequest request, MultipartFile imageFile)
           throws IOException, NotAnImageException, EmailExistException {
        this.helper.checkEmailExistence(0, request.getEmail());
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        String encodedPassword = this.helper.encodePassword(request.getPassword());
        user.setPassword(encodedPassword);
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setGender(request.isGender() ? MALE : FEMALE);

        String defaultImageUrl = this.helper.getDefaultImageUrl();
        user.setImageUrl(defaultImageUrl);
        user.setRegisterDate(LocalDate.now());
        user.setActive(true);
        user.setNotLocked(true);

        user.setRole(ROLE_CUSTOMER.name());
        user.setAuthorities(ROLE_CUSTOMER.getAuthority());
        User savedUser = this.repository.save(user);

        return this.helper.saveUserImage(savedUser, imageFile);
    }

    // 3
    public void deleteByEmail(String email) throws UserNotFoundException, IOException {
        User customer = this.repository.findUserByEmail(email);
        if(customer == null) {
            throw new UserNotFoundException("User not found by email: " + email);
        }
        this.repository.delete(customer);
        this.helper.deleteImageFolder(email);
    }

    // 4
    public User getUserAsCustomer(int id) throws UserNotFoundException {
        if(this.repository.countById(id) == 0) {
            throw new UserNotFoundException("User not found by ID: " + id);
        }
        return this.repository.findById(id).get();
    }

    // 5
    public User updateUserAsCustomer(UpdateCustomerRequest request, MultipartFile imageFile)
           throws IOException, EmailExistException {
        User user = this.helper.checkEmailExistence(request.getId(), request.getEmail());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setGender(request.isGender() ? MALE : FEMALE);
        user.setActive(request.isActive());
        user.setNotLocked(request.isNotLocked());

        User savedUser = this.repository.save(user);

        return this.helper.saveUserImage(savedUser, imageFile);
    }
}
