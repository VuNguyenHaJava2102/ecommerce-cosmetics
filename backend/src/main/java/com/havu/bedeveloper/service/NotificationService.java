package com.havu.bedeveloper.service;

import com.havu.bedeveloper.entity.Notification;
import com.havu.bedeveloper.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepo;

    // 1
    public List<Notification> getAllOrderByIdDesc() {
        return this.notificationRepo.findAllByOrderByIdDesc();
    }

    // 2
    public Notification setOneRead(int id) {
        Notification notification = this.notificationRepo.findById(id).orElse(null);
        if(notification == null) {
            return null;
        }
        notification.setRead(true);
        return this.notificationRepo.save(notification);
    }

    // 3
    public boolean setAllRead() {
        this.notificationRepo.setAllRead();
        return true;
    }

    // 4
    public void add(String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        this.notificationRepo.save(notification);
    }
}
