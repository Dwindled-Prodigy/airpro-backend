package com.airpro.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "seat_categories")
@Data
public class SeatCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private Name name;

    public enum Name {
        ECONOMY, ECONOMY_PLUS, BUSINESS
    }
}
