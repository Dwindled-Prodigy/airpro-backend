package com.airpro.dto.admin;

import lombok.Data;

@Data
public class InventoryRequest {
    private Long flightScheduleId;
    private Long seatCategoryId;
    private Integer totalSeats;
    private Double price;
}
