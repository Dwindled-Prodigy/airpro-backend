package com.airpro.dto.payment;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long bookingId;
    private String paymentMethod;
    private Double amount;
}
