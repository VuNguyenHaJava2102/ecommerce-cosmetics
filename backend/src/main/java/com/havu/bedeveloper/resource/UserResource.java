package com.havu.bedeveloper.resource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.havu.bedeveloper.domain.request.AddCustomerRequest;
import com.havu.bedeveloper.domain.request.UpdateCustomerRequest;
import com.havu.bedeveloper.entity.User;
import com.havu.bedeveloper.exception.domain.EmailExistException;
import com.havu.bedeveloper.exception.domain.NotAnImageException;
import com.havu.bedeveloper.exception.domain.UserNotFoundException;
import com.havu.bedeveloper.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserResource {

    private final UserService service;
    private final ObjectMapper objectMapper;

    // 1 *
    @GetMapping("/all-customers")
    public ResponseEntity<List<User>> getAllUsersAsCustomers() {
        List<User> usersAsCustomers = this.service.getAllUsersAsCustomers();
        return new ResponseEntity<>(usersAsCustomers, HttpStatus.OK);
    }

    // 2 *
    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<User> getUserAsCustomer(@PathVariable("id") int id)
            throws UserNotFoundException {
        User customer = this.service.getUserAsCustomer(id);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    // 3 *
    @PostMapping("/add-customer")
    public ResponseEntity<User> addUserAsCustomer(@RequestParam("request") String requestStr,
                                                  @RequestParam(value = "imageFile", required = false) MultipartFile imageFile)
           throws IOException, NotAnImageException, EmailExistException {
        AddCustomerRequest request = this.objectMapper.readValue(requestStr, AddCustomerRequest.class);
        User saved = this.service.addNewUserAsCustomer(request, imageFile);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // 4 *
    @DeleteMapping("/delete-customer/{email}")
    public ResponseEntity<?> deleteUserAsCustomer(@PathVariable("email") String email)
           throws UserNotFoundException, IOException {
        this.service.deleteByEmail(email);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 5
    @PutMapping("/update-customer")
    public ResponseEntity<User> updateUserAsCustomer(@RequestParam("request") String requestStr,
                                                     @RequestParam(value = "imageFile", required = false) MultipartFile imageFile)
           throws IOException, EmailExistException {
        UpdateCustomerRequest request = this.objectMapper.readValue(requestStr, UpdateCustomerRequest.class);
        User saved = this.service.updateUserAsCustomer(request, imageFile);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }
}
