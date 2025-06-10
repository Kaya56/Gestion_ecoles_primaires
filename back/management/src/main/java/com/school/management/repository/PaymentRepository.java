// repository/PaymentRepository.java
package com.school.management.repository;

import com.school.management.entity.Payment;
import com.school.management.entity.enums.PaymentMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentId(Long studentId);
    List<Payment> findByAcademicYear(String academicYear);
    List<Payment> findByPaymentType(String paymentType);
    List<Payment> findByPaymentMode(PaymentMode paymentMode);
    List<Payment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.academicYear = :year")
    BigDecimal getTotalPaymentsByYear(@Param("year") String academicYear);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.student.id = :studentId AND p.academicYear = :year")
    BigDecimal getTotalPaymentsByStudentAndYear(@Param("studentId") Long studentId, @Param("year") String academicYear);
}