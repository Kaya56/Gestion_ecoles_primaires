package com.school.management.controller;

import com.school.management.dto.request.PaymentCreateRequest;
import com.school.management.dto.response.PaymentResponse;
import com.school.management.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentCreateRequest request) {
        PaymentResponse response = paymentService.createPayment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        List<PaymentResponse> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByStudent(@PathVariable Long studentId) {
        List<PaymentResponse> payments = paymentService.getPaymentsByStudent(studentId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/student/{studentId}/total")
    public ResponseEntity<Map<String, BigDecimal>> getStudentPaymentTotal(
            @PathVariable Long studentId,
            @RequestParam(required = false) String academicYear) {
        BigDecimal total = paymentService.getTotalPaymentsByStudent(studentId, academicYear);
        return ResponseEntity.ok(Map.of("totalAmount", total));
    }
}