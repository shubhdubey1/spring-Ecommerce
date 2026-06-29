package com.springcourse.springecom.controller;

import com.springcourse.springecom.model.dtos.OrderItemRequest;
import com.springcourse.springecom.model.dtos.OrderRequest;
import com.springcourse.springecom.model.dtos.OrderResponse;
import com.springcourse.springecom.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class OrderController {

    @Autowired
    OrderService orderservice;


    @GetMapping("/orders")
public ResponseEntity<List<OrderResponse>> getAllOrders(){
        List<OrderResponse> orders =  orderservice.getAllOrder();
        return new ResponseEntity<>(orders, HttpStatus.OK);
   }

   @PostMapping("/orders/place")
   public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest orderRequest){

        OrderResponse orderResponse = orderservice.placeOrder(orderRequest);
        return  new ResponseEntity<>(orderResponse,HttpStatus.CREATED);

   }


}
