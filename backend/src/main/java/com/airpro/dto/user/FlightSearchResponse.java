package com.airpro.dto.user;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class FlightSearchResponse {
    private Long flightScheduleId;
    private String flightNumber;
    private String carrierName;
    private String origin;
    private String destination;
    private LocalDate travelDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private List<SeatCategoryDto> seatCategories;

    @Data
    public static class SeatCategoryDto {
        private Long seatCategoryId;
        private String categoryName;
        private Integer totalSeats;
        private Integer availableSeats;
        private Double price;
    }
}
