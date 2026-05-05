package com.airpro.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "flight_seat_inventory", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"flight_schedule_id", "seat_category_id"})
})
@Data
public class FlightSeatInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_schedule_id", nullable = false)
    private FlightSchedule flightSchedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_category_id", nullable = false)
    private SeatCategory seatCategory;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(nullable = false)
    private Double price;
}
