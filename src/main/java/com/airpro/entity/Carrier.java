package com.airpro.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "carriers")
@Data
public class Carrier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(name = "discount_percentage")
    private Double discountPercentage = 0.0;

    @Column(name = "refund_allowed")
    private Boolean refundAllowed = true;
}
