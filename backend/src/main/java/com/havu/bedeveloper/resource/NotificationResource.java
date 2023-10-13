package com.havu.bedeveloper.resource;

import com.havu.bedeveloper.entity.Notification;
import com.havu.bedeveloper.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationResource {

    private final NotificationService service;

    // 1
    @GetMapping("/get-all")
    public ResponseEntity<List<Notification>> getAllOrderByIdDesc() {
        List<Notification> notifications = this.service.getAllOrderByIdDesc();
        return new ResponseEntity<>(notifications, OK);
    }

    // 2
    @GetMapping("/set-one-read/{id}")
    public ResponseEntity<Notification> setOneRead(@PathVariable("id") int id) {
        Notification notification = this.service.setOneRead(id);
        if(notification == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(notification, OK);
    }

    // 3
    @GetMapping("/set-all-read")
    public ResponseEntity<?> setAllRead() {
        boolean result = service.setAllRead();
        if(!result) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(OK);
    }

    // 4
    @PostMapping("/add")
    public ResponseEntity<Notification> add(@RequestParam("message") String message) {
        this.service.add(message);
        return new ResponseEntity<>(CREATED);
    }
}
