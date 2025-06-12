// mapper/PaymentMapper.java
package com.school.management.mapper;

import com.school.management.dto.request.PaymentCreateRequest;
import com.school.management.dto.response.PaymentResponse;
import com.school.management.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public Payment toEntity(PaymentCreateRequest request) {
        Payment payment = new Payment();
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(request.getPaymentDate());
        payment.setPaymentMode(request.getPaymentMode());
        payment.setPaymentType(request.getPaymentType());
        payment.setAcademicYear(request.getAcademicYear());
        payment.setDescription(request.getDescription());
        payment.setReceiptNumber(request.getReceiptNumber());
        return payment;
    }

    public PaymentResponse toResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setStudentName(payment.getStudent().getFirstName() + " " + payment.getStudent().getLastName());
        response.setAmount(payment.getAmount());
        response.setPaymentDate(payment.getPaymentDate());
        response.setPaymentMode(payment.getPaymentMode());
        response.setPaymentType(payment.getPaymentType());
        response.setAcademicYear(payment.getAcademicYear());
        response.setDescription(payment.getDescription());
        response.setReceiptNumber(payment.getReceiptNumber());
        return response;
    }
}