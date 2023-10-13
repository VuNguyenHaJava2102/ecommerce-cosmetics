package com.havu.bedeveloper.domain.request;

import lombok.Getter;

@Getter
public class AddCartItemRequest {

    private int id;
    private int quantity;
    private double price;
    private int productId;
    private int userId;
}
