package com.airpro.config;

import com.airpro.entity.User;
import com.airpro.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Timestamp;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin user already exists
            if (userRepository.findByEmail("admin@skyops.in").isEmpty()) {
                User admin = new User();
                admin.setName("Super Admin");
                admin.setEmail("admin@skyops.in");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(User.Role.ADMIN);
                admin.setCategory(User.Category.REGULAR);
                admin.setCreatedAt(new Timestamp(System.currentTimeMillis()));

                userRepository.save(admin);
                System.out.println("✅ Super Admin account created (admin@skyops.in / admin123)");
            }
        };
    }
}
