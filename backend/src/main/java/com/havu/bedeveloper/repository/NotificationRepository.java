package com.havu.bedeveloper.repository;

import com.havu.bedeveloper.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> findAllByOrderByIdDesc();

    @Modifying
    @Query(value = """
                   UPDATE notification
                   SET is_read = true
                   """, nativeQuery = true)
    void setAllRead();
}
