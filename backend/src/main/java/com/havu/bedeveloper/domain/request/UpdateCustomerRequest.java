package com.havu.bedeveloper.domain.request;

import lombok.Getter;

@Getter
public class UpdateCustomerRequest {

    private int id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private boolean gender;
    private boolean active;
    private boolean notLocked;

    @Override
    public String toString() {
        return "UpdateCustomerRequest{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", address='" + address + '\'' +
                ", gender=" + gender +
                ", active=" + active +
                ", notLocked=" + notLocked +
                '}';
    }
}
