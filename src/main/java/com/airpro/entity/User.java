package com.airpro.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(name = "created_at")
    private Timestamp createdAt;

    public enum Role {
        USER, ADMIN
    }

    public enum Category {
        REGULAR, SILVER, GOLD
    }
}