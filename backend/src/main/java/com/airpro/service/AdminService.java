package com.airpro.service;

import com.airpro.dto.ApiResponse;
import com.airpro.dto.admin.CarrierRequest;
import com.airpro.dto.admin.FlightRequest;
import com.airpro.dto.admin.InventoryRequest;
import com.airpro.dto.admin.ScheduleRequest;
import com.airpro.entity.*;
import com.airpro.repository.*;
import org.springframework.stereotype.Service;
import java.util.Objects;

@Service
public class AdminService {

    private final CarrierRepository carrierRepo;
    private final FlightRepository flightRepo;
    private final FlightScheduleRepository scheduleRepo;
    private final SeatCategoryRepository categoryRepo;
    private final FlightSeatInventoryRepository inventoryRepo;
    private final UserRepository userRepo;
    private final BookingRepository bookingRepo;

    public AdminService(CarrierRepository carrierRepo, FlightRepository flightRepo,
                        FlightScheduleRepository scheduleRepo, SeatCategoryRepository categoryRepo,
                        FlightSeatInventoryRepository inventoryRepo, UserRepository userRepo,
                        BookingRepository bookingRepo) {
        this.carrierRepo = carrierRepo;
        this.flightRepo = flightRepo;
        this.scheduleRepo = scheduleRepo;
        this.categoryRepo = categoryRepo;
        this.inventoryRepo = inventoryRepo;
        this.userRepo = userRepo;
        this.bookingRepo = bookingRepo;
    }

    public ApiResponse<Carrier> createCarrier(CarrierRequest request) {
        Carrier carrier = new Carrier();
        carrier.setName(request.getName());
        carrier.setDiscountPercentage(request.getDiscountPercentage());
        carrier.setRefundAllowed(request.getRefundAllowed());
        carrierRepo.save(carrier);
        return ApiResponse.success(carrier, "Carrier created successfully");
    }

    public ApiResponse<Flight> createFlight(FlightRequest request) {
        Carrier carrier = carrierRepo.findById(Objects.requireNonNull(request.getCarrierId(), "Carrier ID must not be null"))
                .orElseThrow(() -> new IllegalArgumentException("Carrier not found"));

        Flight flight = new Flight();
        flight.setFlightNumber(request.getFlightNumber());
        flight.setCarrier(carrier);
        flight.setOrigin(request.getOrigin());
        flight.setDestination(request.getDestination());
        flight.setBasePrice(request.getBasePrice());
        flight.setRefundAllowed(request.getRefundAllowed());

        flightRepo.save(flight);
        return ApiResponse.success(flight, "Flight created successfully");
    }

    public ApiResponse<FlightSchedule> createSchedule(ScheduleRequest request) {
        Flight flight = flightRepo.findById(Objects.requireNonNull(request.getFlightId(), "Flight ID must not be null"))
                .orElseThrow(() -> new IllegalArgumentException("Flight not found"));

        FlightSchedule schedule = new FlightSchedule();
        schedule.setFlight(flight);
        schedule.setTravelDate(request.getTravelDate());
        schedule.setDepartureTime(request.getDepartureTime());
        schedule.setArrivalTime(request.getArrivalTime());

        scheduleRepo.save(schedule);
        return ApiResponse.success(schedule, "Flight Schedule created successfully");
    }

    public ApiResponse<FlightSeatInventory> createInventory(InventoryRequest request) {
        FlightSchedule schedule = scheduleRepo.findById(Objects.requireNonNull(request.getFlightScheduleId(), "Flight Schedule ID must not be null"))
                .orElseThrow(() -> new IllegalArgumentException("Flight Schedule not found"));

        SeatCategory category = categoryRepo.findById(Objects.requireNonNull(request.getSeatCategoryId(), "Seat Category ID must not be null"))
                .orElseThrow(() -> new IllegalArgumentException("Seat Category not found"));

        if (inventoryRepo.findByFlightScheduleIdAndSeatCategoryId(schedule.getId(), category.getId()).isPresent()) {
            throw new IllegalArgumentException("Inventory for this schedule and category already exists");
        }

        FlightSeatInventory inventory = new FlightSeatInventory();
        inventory.setFlightSchedule(schedule);
        inventory.setSeatCategory(category);
        inventory.setTotalSeats(request.getTotalSeats());
        inventory.setAvailableSeats(request.getTotalSeats());
        inventory.setPrice(request.getPrice());

        inventoryRepo.save(inventory);
        return ApiResponse.success(inventory, "Inventory created successfully");
    }

    public ApiResponse<java.util.List<Carrier>> getAllCarriers() {
        return ApiResponse.success(carrierRepo.findAll(), "Carriers retrieved successfully");
    }

    public ApiResponse<java.util.List<Flight>> getAllFlights() {
        return ApiResponse.success(flightRepo.findAll(), "Flights retrieved successfully");
    }

    public ApiResponse<java.util.List<FlightSchedule>> getAllSchedules() {
        return ApiResponse.success(scheduleRepo.findAll(), "Schedules retrieved successfully");
    }

    public ApiResponse<java.util.List<FlightSeatInventory>> getAllInventories() {
        return ApiResponse.success(inventoryRepo.findAll(), "Inventories retrieved successfully");
    }

    public ApiResponse<java.util.List<User>> getAllUsers() {
        return ApiResponse.success(userRepo.findAll(), "Users retrieved successfully");
    }

    public ApiResponse<java.util.List<Booking>> getAllBookings() {
        return ApiResponse.success(bookingRepo.findAll(), "Bookings retrieved successfully");
    }
}
