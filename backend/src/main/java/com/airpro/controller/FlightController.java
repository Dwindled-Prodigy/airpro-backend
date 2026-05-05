package com.airpro.controller;

import com.airpro.dto.ApiResponse;
import com.airpro.dto.user.FlightSearchResponse;
import com.airpro.service.FlightSearchService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightSearchService flightSearchService;

    public FlightController(FlightSearchService flightSearchService) {
        this.flightSearchService = flightSearchService;
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<FlightSearchResponse>>> searchFlights(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate travelDate) {
        return ResponseEntity.ok(flightSearchService.searchFlights(origin, destination, travelDate));
    }
}
