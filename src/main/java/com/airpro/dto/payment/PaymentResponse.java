package com.airpro.dto.payment;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class PaymentResponse {
    private Long paymentId;
    private String status;
    private Timestamp paymentTime;
}
