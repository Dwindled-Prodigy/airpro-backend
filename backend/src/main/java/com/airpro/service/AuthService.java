package com.airpro.service;

import com.airpro.entity.User;
import com.airpro.repository.UserRepository;
import com.airpro.dto.RegisterRequest;
import com.airpro.dto.LoginRequest;
import com.airpro.dto.ApiResponse;
import com.airpro.config.JwtUtil;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Timestamp;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepo,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // 🔥 REGISTER
    public ApiResponse<String> register(RegisterRequest request) {

        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole(User.Role.USER);
        user.setCategory(User.Category.REGULAR);
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        userRepo.save(user);

        return ApiResponse.success("User registered successfully", "Registration Successful");
    }

    // 🔥 LOGIN
    public ApiResponse<String> login(LoginRequest request) {

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getName());
        return ApiResponse.success(token, "Login Successful");
    }

    // 🔥 UPDATE PASSWORD
    public ApiResponse<String> updatePassword(String email, com.airpro.dto.UpdatePasswordRequest request) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);

        return ApiResponse.success("Success", "Password updated successfully");
    }
}