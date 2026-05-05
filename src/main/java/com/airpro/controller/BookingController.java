package com.airpro.controller;

import com.airpro.dto.ApiResponse;
import com.airpro.dto.booking.BookingRequest;
import com.airpro.dto.booking.BookingResponse;
import com.airpro.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> bookFlight(Authentication authentication, @RequestBody BookingRequest request) {
        String email = authentication.getName(); // Extracted from JWT
        return ResponseEntity.ok(bookingService.bookFlight(email, request));
    }
}
