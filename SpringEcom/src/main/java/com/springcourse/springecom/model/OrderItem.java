package com.springcourse.springecom.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne
    private  Product product;
    private  int quantity;
    private BigDecimal totalPrice;
    @ManyToOne(fetch = FetchType.LAZY)
    private  Order order;

}