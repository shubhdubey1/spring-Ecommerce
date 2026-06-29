package com.springcourse.springecom.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Product {

    @Id
    @GeneratedValue(generator = "my_seq", strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(name = "my_seq", sequenceName = "my_own_seq", initialValue = 101, allocationSize = 1)
    private Integer id;
    private  String name;
    private  String description;
    private String brand;
    private BigDecimal price;
    private String category;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private Date releaseDate;
    private int stockQuantity;
    private boolean productAvailable;
    private String imageName;
    private String imageType;
    @Lob
    private byte[] imageData;

    public Product(int i) {
    }
}
