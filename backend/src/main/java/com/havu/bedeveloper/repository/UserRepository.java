package com.havu.bedeveloper.repository;

import com.havu.bedeveloper.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {

    int countById(int id);

    User findUserByEmail(String email);

    List<User> findByRole(String role);
}
