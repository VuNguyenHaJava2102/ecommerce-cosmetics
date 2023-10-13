package com.havu.bedeveloper.domain.request;

import lombok.Getter;

@Getter
public class AddOrderRequest {

    private String address;
    private String phone;
    private int userId;
    private Integer[] cartItemIds;
}
