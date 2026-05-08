package com.airpro.controller;

import com.airpro.dto.ApiResponse;
import com.airpro.dto.UpdatePasswordRequest;
import com.airpro.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @PutMapping("/update-password")
    public ResponseEntity<ApiResponse<String>> updatePassword(Authentication authentication, @RequestBody UpdatePasswordRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(authService.updatePassword(email, request));
    }
}
