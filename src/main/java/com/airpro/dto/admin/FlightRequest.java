package com.airpro.dto.admin;

import lombok.Data;

@Data
public class FlightRequest {
    private String flightNumber;
    private Long carrierId;
    private String origin;
    private String destination;
    private Double basePrice;
    private Boolean refundAllowed;
}
