package com.airpro.service;

import com.airpro.dto.ApiResponse;
import com.airpro.dto.payment.PaymentRequest;
import com.airpro.dto.payment.PaymentResponse;
import com.airpro.entity.Booking;
import com.airpro.entity.Payment;
import com.airpro.repository.BookingRepository;
import com.airpro.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import java.util.Objects;

import java.sql.Timestamp;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final BookingRepository bookingRepo;

    public PaymentService(PaymentRepository paymentRepo, BookingRepository bookingRepo) {
        this.paymentRepo = paymentRepo;
        this.bookingRepo = bookingRepo;
    }

    public ApiResponse<PaymentResponse> processPayment(PaymentRequest request) {
        Booking booking = bookingRepo.findById(Objects.requireNonNull(request.getBookingId(), "Booking ID must not be null"))
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getTotalAmount().equals(request.getAmount())) {
            throw new IllegalArgumentException("Payment amount does not match booking amount");
        }

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(request.getAmount());
        payment.setPaymentStatus(Payment.Status.SUCCESS);
        payment.setPaymentTime(new Timestamp(System.currentTimeMillis()));

        payment = paymentRepo.save(payment);

        PaymentResponse response = new PaymentResponse();
        response.setPaymentId(payment.getId());
        response.setStatus(payment.getPaymentStatus().name());
        response.setPaymentTime(payment.getPaymentTime());

        return ApiResponse.success(response, "Payment processed successfully");
    }
}
