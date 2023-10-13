package com.havu.bedeveloper.resource;

import com.havu.bedeveloper.security.CustomUserDetails;
import com.havu.bedeveloper.domain.request.LoginRequest;
import com.havu.bedeveloper.domain.request.RegisterRequest;
import com.havu.bedeveloper.entity.User;
import com.havu.bedeveloper.exception.domain.EmailExistException;
import com.havu.bedeveloper.exception.domain.EmailNotFoundException;
import com.havu.bedeveloper.jwt.JwtTokenProvider;
import com.havu.bedeveloper.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.havu.bedeveloper.constant.SecurityConstant.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class AuthenticationResource {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    // 1
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) throws EmailNotFoundException {
        Authentication authentication = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
        this.authenticationManager.authenticate(authentication);

        // if credentials right, code continue
        User user = this.userService.getUserByEmail(request.getEmail());
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = this.jwtTokenProvider.generateToken(userDetails);

        HttpHeaders headers = new HttpHeaders();
        headers.add(TOKEN_HEADER, token);
        return new ResponseEntity<>(user, headers, HttpStatus.OK);
    }

    // 2
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request)
           throws EmailExistException {
        User user = this.userService.registerUserAsCustomer(request);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
