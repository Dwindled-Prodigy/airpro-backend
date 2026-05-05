package com.airpro.dto.admin;

import lombok.Data;

@Data
public class CarrierRequest {
    private String name;
    private Double discountPercentage;
    private Boolean refundAllowed;
}
