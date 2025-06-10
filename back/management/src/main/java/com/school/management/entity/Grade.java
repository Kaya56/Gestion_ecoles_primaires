// entity/Grade.java - Version corrigée
package com.school.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "grades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    // Changé de Double à BigDecimal pour plus de précision + renommé
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal value; // était "score"

    @Column(nullable = false)
    private String semester; // était "term" - cohérent avec le service

    @Column(nullable = false)
    private String academicYear;

    private String examType; // Devoir, Composition, etc.

    @Column(nullable = false)
    private LocalDate gradeDate = LocalDate.now();

    private String comments;
}

