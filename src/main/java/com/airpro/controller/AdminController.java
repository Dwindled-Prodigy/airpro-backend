package com.airpro.controller;

import com.airpro.dto.ApiResponse;
import com.airpro.dto.admin.CarrierRequest;
import com.airpro.dto.admin.FlightRequest;
import com.airpro.dto.admin.InventoryRequest;
import com.airpro.dto.admin.ScheduleRequest;
import com.airpro.entity.Carrier;
import com.airpro.entity.Flight;
import com.airpro.entity.FlightSchedule;
import com.airpro.entity.FlightSeatInventory;
import com.airpro.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/carriers")
    public ResponseEntity<ApiResponse<Carrier>> createCarrier(@RequestBody CarrierRequest request) {
        return ResponseEntity.ok(adminService.createCarrier(request));
    }

    @PostMapping("/flights")
    public ResponseEntity<ApiResponse<Flight>> createFlight(@RequestBody FlightRequest request) {
        return ResponseEntity.ok(adminService.createFlight(request));
    }

    @PostMapping("/schedules")
    public ResponseEntity<ApiResponse<FlightSchedule>> createSchedule(@RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(adminService.createSchedule(request));
    }

    @PostMapping("/inventory")
    public ResponseEntity<ApiResponse<FlightSeatInventory>> createInventory(@RequestBody InventoryRequest request) {
        return ResponseEntity.ok(adminService.createInventory(request));
    }
}
