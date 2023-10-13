package com.havu.bedeveloper.domain.request;

import lombok.Getter;

@Getter
public class AddCustomerRequest {

    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    private boolean gender;
}
