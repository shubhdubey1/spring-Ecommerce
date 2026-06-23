package com.springcourse.springecom.model.dtos;

public record OrderItemRequest(
        int productId,
        int quantity
) {
}
