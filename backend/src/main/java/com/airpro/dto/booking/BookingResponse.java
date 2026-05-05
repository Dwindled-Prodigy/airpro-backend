package com.airpro.dto.booking;

import lombok.Data;

@Data
public class BookingResponse {
    private Long bookingId;
    private String bookingRef;
    private String status;
    private Double totalAmount;
}
