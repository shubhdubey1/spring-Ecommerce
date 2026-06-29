package com.springcourse.springecom.controller;


import com.springcourse.springecom.model.Product;
import com.springcourse.springecom.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService service;


    @GetMapping("products")
    public ResponseEntity<List<Product> >getProducts(){
       return new ResponseEntity<>(service.getProducts(), HttpStatus.OK);
    }

    @GetMapping("product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id){
        Product product = service.getById(id);
        if(product.getId()>0){
            return new ResponseEntity<>(product, HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("product/{productid}/image")
    public ResponseEntity<byte[]> getProductImageById(@PathVariable int productid){
       Product product = service.getById(productid);
       if(product.getId()>0){
           return new ResponseEntity<>(product.getImageData(),HttpStatus.OK);
       }
       else{
           return new ResponseEntity<>(HttpStatus.NOT_FOUND);
       }
    }

    @PostMapping("product")
    public ResponseEntity<?> addProduct(@RequestPart Product product, @RequestPart MultipartFile imageFile){
        Product savedproduct = null;
        try {
           savedproduct = service.addOrUpdateProduct(product,imageFile);
            return new ResponseEntity<>(savedproduct,HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("product/{productid}")
    public ResponseEntity<String> updateProduct(@PathVariable int productid,@RequestPart Product product, @RequestPart MultipartFile imageFile) {
        Product updatedproduct = null;
        updatedproduct = service.getById(productid);
        if(updatedproduct.getId()<0){
            return  new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            service.addOrUpdateProduct(product, imageFile);
            return  new ResponseEntity<>("Updated successfully!", HttpStatus.OK);
        } catch (IOException e) {
            return  new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }
    @DeleteMapping("product/{productid}")
    public ResponseEntity<String> deleteProduct(@PathVariable int productid){

        Product deletedproductToBe = null;
        deletedproductToBe = service.getById(productid);
        if(deletedproductToBe.getId() <0){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }else{
            service.deleteProduct(productid);
            return  new ResponseEntity<>("deleted successfully!", HttpStatus.OK);
        }

    }

    @GetMapping("products/search")
    public ResponseEntity<List<Product>> searchProductByKeyword(@RequestParam String keyword){

        List<Product> prodlist = service.searchProductByKeyword(keyword);
        return new ResponseEntity<>(prodlist,HttpStatus.OK);
    }

}
