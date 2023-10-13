package com.havu.bedeveloper.domain.request;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class AddUpdateProductRequest {

    private int id;
    private String productCode;
    private String name;
    private int quantity;
    private double price;
    private int discount;
    private String description;
    private LocalDate enteredDate;
    private boolean active;
    private int sold;
    private int categoryId;

    @Override
    public String toString() {
        return "AddUpdateProductRequest{" +
                "id=" + id +
                ", productCode='" + productCode + '\'' +
                ", name='" + name + '\'' +
                ", quantity=" + quantity +
                ", price=" + price +
                ", discount=" + discount +
                ", description='" + description + '\'' +
                ", enteredDate=" + enteredDate +
                ", active=" + active +
                ", sold=" + sold +
                ", categoryId=" + categoryId +
                '}';
    }
}
