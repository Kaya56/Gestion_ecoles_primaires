package com.school.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "equipment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(unique = true, nullable = false)
    private String serialNumber;

    private String category;
    private String brand;
    private String model;

    @Column(precision = 10, scale = 2)
    private BigDecimal purchasePrice;

    private LocalDate purchaseDate;
    private LocalDate warrantyExpiryDate;
    private LocalDate maintenanceDate; // AJOUTÉ

    @Column(nullable = false)
    private String status; // Bon état, En panne, En réparation

    private String location;
    private String assignedTo;
}

