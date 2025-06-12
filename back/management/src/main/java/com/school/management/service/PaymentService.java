// service/PaymentService.java
package com.school.management.service;

import com.school.management.dto.request.PaymentCreateRequest;
import com.school.management.dto.response.PaymentResponse;
import com.school.management.entity.Payment;
import com.school.management.entity.Student;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.mapper.PaymentMapper;
import com.school.management.repository.PaymentRepository;
import com.school.management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;
    private final PaymentMapper paymentMapper;

    public PaymentResponse createPayment(PaymentCreateRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Élève non trouvé"));

        Payment payment = paymentMapper.toEntity(request);
        payment.setStudent(student);

        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toResponse(savedPayment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByStudent(Long studentId) {
        return paymentRepository.findByStudentId(studentId).stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalPaymentsByStudent(Long studentId, String academicYear) {
        BigDecimal total = paymentRepository.getTotalPaymentsByStudentAndYear(studentId, academicYear);
        return total != null ? total : BigDecimal.ZERO;
    }
}