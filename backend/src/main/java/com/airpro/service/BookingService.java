package com.airpro.service;

import com.airpro.dto.ApiResponse;
import com.airpro.dto.booking.BookingRequest;
import com.airpro.dto.booking.BookingResponse;
import com.airpro.entity.Booking;
import com.airpro.entity.FlightSchedule;
import com.airpro.entity.FlightSeatInventory;
import com.airpro.entity.SeatCategory;
import com.airpro.entity.User;
import com.airpro.repository.BookingRepository;
import com.airpro.repository.FlightScheduleRepository;
import com.airpro.repository.FlightSeatInventoryRepository;
import com.airpro.repository.SeatCategoryRepository;
import com.airpro.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Objects;

import java.sql.Timestamp;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepo;
    private final FlightScheduleRepository scheduleRepo;
    private final FlightSeatInventoryRepository inventoryRepo;
    private final SeatCategoryRepository categoryRepo;
    private final UserRepository userRepo;

    public BookingService(BookingRepository bookingRepo, FlightScheduleRepository scheduleRepo,
                          FlightSeatInventoryRepository inventoryRepo, SeatCategoryRepository categoryRepo,
                          UserRepository userRepo) {
        this.bookingRepo = bookingRepo;
        this.scheduleRepo = scheduleRepo;
        this.inventoryRepo = inventoryRepo;
        this.categoryRepo = categoryRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public ApiResponse<BookingResponse> bookFlight(String userEmail, BookingRequest request) {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        FlightSchedule schedule = scheduleRepo.findById(Objects.requireNonNull(request.getFlightScheduleId(), "Flight Schedule ID must not be null"))
                .orElseThrow(() -> new IllegalArgumentException("Flight Schedule not found"));

        SeatCategory category = categoryRepo.findById(Objects.requireNonNull(request.getSeatCategoryId(), "Seat Category ID must not be null"))
                .orElseThrow(() -> new IllegalArgumentException("Seat Category not found"));

        FlightSeatInventory inventory = inventoryRepo.findByFlightScheduleIdAndSeatCategoryId(schedule.getId(), category.getId())
                .orElseThrow(() -> new IllegalArgumentException("Seat inventory not found for this schedule and category"));

        if (inventory.getAvailableSeats() < request.getSeatsToBook()) {
            throw new IllegalArgumentException("Not enough seats available");
        }

        // Deduct seats
        inventory.setAvailableSeats(inventory.getAvailableSeats() - request.getSeatsToBook());
        inventoryRepo.save(inventory);

        // Calculate amount
        Double totalAmount = inventory.getPrice() * request.getSeatsToBook();

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setFlightSchedule(schedule);
        booking.setSeatCategory(category);
        booking.setSeatsBooked(request.getSeatsToBook());
        booking.setPricePerSeat(inventory.getPrice());
        booking.setTotalAmount(totalAmount);
        booking.setBookingRef(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setBookingTime(new Timestamp(System.currentTimeMillis()));
        booking.setStatus(Booking.Status.CONFIRMED);

        booking = bookingRepo.save(booking);

        BookingResponse response = new BookingResponse();
        response.setBookingId(booking.getId());
        response.setBookingRef(booking.getBookingRef());
        response.setStatus(booking.getStatus().name());
        response.setTotalAmount(booking.getTotalAmount());

        return ApiResponse.success(response, "Booking successful");
    }

    @Transactional(readOnly = true)
    public ApiResponse<java.util.List<Booking>> getMyBookings(String userEmail) {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ApiResponse.success(bookingRepo.findByUserId(user.getId()), "Bookings retrieved successfully");
    }

    @Transactional
    public ApiResponse<String> cancelBooking(Long id, String userEmail) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new SecurityException("You do not have permission to cancel this booking");
        }

        if (booking.getStatus() == Booking.Status.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled");
        }

        booking.setStatus(Booking.Status.CANCELLED);
        bookingRepo.save(booking);

        FlightSeatInventory inventory = inventoryRepo.findByFlightScheduleIdAndSeatCategoryId(
                booking.getFlightSchedule().getId(), booking.getSeatCategory().getId()
        ).orElseThrow(() -> new IllegalArgumentException("Seat inventory not found"));

        inventory.setAvailableSeats(inventory.getAvailableSeats() + booking.getSeatsBooked());
        inventoryRepo.save(inventory);

        return ApiResponse.success("Cancelled", "Booking cancelled successfully and seats restored");
    }
}
