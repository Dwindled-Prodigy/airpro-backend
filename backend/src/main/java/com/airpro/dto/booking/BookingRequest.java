package com.airpro.dto.booking;

import lombok.Data;

@Data
public class BookingRequest {
    private Long flightScheduleId;
    private Long seatCategoryId;
    private Integer seatsToBook;
}
