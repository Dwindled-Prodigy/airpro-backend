package com.airpro.dto.admin;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ScheduleRequest {
    private Long flightId;
    private LocalDate travelDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
}
