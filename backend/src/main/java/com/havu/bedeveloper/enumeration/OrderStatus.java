package com.havu.bedeveloper.enumeration;

public enum OrderStatus {

    ORDERED("Đơn hàng của bạn đã được đặt"),
    CONFIRMED("Đơn hàng của bạn đã được xác nhận bởi cửa hàng"),
    READY_TO_DELIVERY("Đơn hàng của bạn đã sẵn sàng được giao"),
    TAKEN("Đơn hàng của bạn đã được lấy đi bởi đơn vị vận chuyển"),
    DELIVERING("Đơn hàng của bạn đang được giao"),
    DELIVERED("Đơn hàng của bạn đã được giao"),
    CANCEL("Đơn hàng của bạn đã bị hủy");

    private String description;

    OrderStatus(String description) {
        this.description = description;
    }
}
