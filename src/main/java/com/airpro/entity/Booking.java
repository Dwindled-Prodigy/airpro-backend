package com.airpro.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_schedule_id", nullable = false)
    private FlightSchedule flightSchedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_category_id", nullable = false)
    private SeatCategory seatCategory;

    @Column(name = "seats_booked", nullable = false)
    private Integer seatsBooked;

    @Column(name = "price_per_seat", nullable = false)
    private Double pricePerSeat;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "booking_ref", unique = true, nullable = false)
    private String bookingRef;

    @Column(name = "booking_time", nullable = false)
    private Timestamp bookingTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        CONFIRMED, CANCELLED
    }
}
