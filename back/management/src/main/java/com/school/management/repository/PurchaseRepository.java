// repository/PurchaseRepository.java - Version corrigée
package com.school.management.repository;

import com.school.management.entity.Purchase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByCategory(String category);
    List<Purchase> findBySupplier(String supplier);

    // AJOUTÉ - méthode manquante pour recherche insensible à la casse
    List<Purchase> findBySupplierContainingIgnoreCase(String supplier);

    List<Purchase> findByPurchaseDateBetween(LocalDate startDate, LocalDate endDate);

    // AJOUTÉ - version avec pagination manquante
    Page<Purchase> findByPurchaseDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    // CORRIGÉ - nom de méthode et champ pour cohérence
    @Query("SELECT SUM(p.totalAmount) FROM Purchase p WHERE p.purchaseDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalAmountByDateRange(@Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);

    // Méthodes supplémentaires utiles
    @Query("SELECT p FROM Purchase p WHERE p.supplier = :supplier AND p.purchaseDate BETWEEN :startDate AND :endDate")
    List<Purchase> findBySupplierAndDateRange(@Param("supplier") String supplier,
                                              @Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);

    @Query("SELECT p FROM Purchase p WHERE p.category = :category AND p.purchaseDate BETWEEN :startDate AND :endDate")
    List<Purchase> findByCategoryAndDateRange(@Param("category") String category,
                                              @Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(p.totalAmount) FROM Purchase p WHERE p.supplier = :supplier")
    BigDecimal getTotalAmountBySupplier(@Param("supplier") String supplier);

    @Query("SELECT SUM(p.totalAmount) FROM Purchase p WHERE p.category = :category")
    BigDecimal getTotalAmountByCategory(@Param("category") String category);

    // Recherche par numéro de facture
    Purchase findByInvoiceNumber(String invoiceNumber);
    boolean existsByInvoiceNumber(String invoiceNumber);
}