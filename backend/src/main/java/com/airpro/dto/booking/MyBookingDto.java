package com.airpro.dto.booking;

import lombok.Data;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class MyBookingDto {
    private Long id;
    private String status;
    private Timestamp bookingTime;
    private String bookingRef;
    private String origin;
    private String destination;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private LocalDate travelDate;
    private String flightNumber;
    private String seatCategoryName;
    private Integer seatsBooked;
    private Double totalAmount;
}
