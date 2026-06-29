package com.springcourse.springecom.service;

import com.springcourse.springecom.model.Order;
import com.springcourse.springecom.model.OrderItem;
import com.springcourse.springecom.model.Product;
import com.springcourse.springecom.model.dtos.OrderItemRequest;
import com.springcourse.springecom.model.dtos.OrderItemResponse;
import com.springcourse.springecom.model.dtos.OrderRequest;
import com.springcourse.springecom.model.dtos.OrderResponse;
import com.springcourse.springecom.repository.OrderRepo;
import com.springcourse.springecom.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
public class OrderService {

    @Autowired
    ProductRepo productRepo;
    @Autowired
    OrderRepo orderRepo;


    public OrderResponse placeOrder(OrderRequest request) {

        Order order = new Order();
        String orderId = "ORD"+UUID.randomUUID().toString().substring(0,8).toUpperCase();

        order.setOrderId(orderId);
        order.setCustomerName(request.customerName());
        order.setEmail(request.email());
        order.setStatus("PLACED");
        order.setOrderDate(LocalDate.now());
        List<OrderItem> orderItems = new ArrayList<>();
        for(OrderItemRequest itemReq : request.items()){
            Product product = productRepo.findById(itemReq.productId())
                    .orElseThrow(()-> new RuntimeException("Product Not Found!"));

            product.setStockQuantity(product.getStockQuantity()-itemReq.quantity());
            productRepo.save(product);

            OrderItem orderItem = OrderItem.builder()

                    .product(product)
                    .quantity(itemReq.quantity())
                    .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity())))
                    .order(order)
                    .build();

            orderItems.add(orderItem);
        }
        order.setItems(orderItems);
        Order savedOrder = orderRepo.save(order);

        List<OrderItemResponse> orderItemResponses = new ArrayList<>();
        for(OrderItem item : order.getItems()){
            OrderItemResponse orderItemResponse = new OrderItemResponse(
                    item.getProduct().getName(),
                    item.getQuantity(),
                    item.getTotalPrice()
            );
            orderItemResponses.add(orderItemResponse);
        }
    OrderResponse orderResponse = new OrderResponse(
            savedOrder.getOrderId(),
            savedOrder.getCustomerName(),
            savedOrder.getEmail(),
            savedOrder.getStatus(),
            savedOrder.getOrderDate(),
            orderItemResponses


    );
    return  orderResponse;

    }

    public List<OrderResponse> getAllOrder(){
        List<Order> orders =  orderRepo.findAll();
        List<OrderResponse> orderResponses = new ArrayList<>();

        for(Order order : orders){
            List<OrderItemResponse> orderItemResponses = new ArrayList<>();

            for(OrderItem item : order.getItems()){
                OrderItemResponse orderItemResponse = new OrderItemResponse(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getTotalPrice()
                );

                orderItemResponses.add(orderItemResponse);
            }

            OrderResponse orderResponse = new OrderResponse(

                    order.getOrderId(),
                    order.getCustomerName(),
                    order.getEmail(),
                    order.getStatus(),
                    order.getOrderDate(),
                    orderItemResponses

            );
            orderResponses.add(orderResponse);
        }
        return orderResponses;

        }

    }

