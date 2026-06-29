package com.springcourse.springecom.service;

import com.springcourse.springecom.model.Product;
import com.springcourse.springecom.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
private ProductRepo repo;
    public List<Product> getProducts() {

        return repo.findAll();
    }

    public Product getById(int id) {
        return repo.findById(id).orElse(new Product(-1));
    }


    public Product addOrUpdateProduct(Product product, MultipartFile imageFile) throws IOException {

        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageData(imageFile.getBytes());
        return repo.save(product);
    }

    public void deleteProduct(int productid) {

        repo.deleteById(productid);
    }

    public List<Product> searchProductByKeyword(String keyword) {
       return repo.searchProductByKeyword(keyword);
    }
}
