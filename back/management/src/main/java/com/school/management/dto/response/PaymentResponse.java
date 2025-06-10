// dto/response/PaymentResponse.java
package com.school.management.dto.response;

import com.school.management.entity.enums.PaymentMode;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PaymentResponse {
    private Long id;
    private String studentName;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private PaymentMode paymentMode;
    private String paymentType;
    private String academicYear;
    private String description;
    private String receiptNumber;
}