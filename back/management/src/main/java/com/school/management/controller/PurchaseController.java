package com.school.management.controller;

import com.school.management.entity.Purchase;
import com.school.management.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "*")
public class PurchaseController {

    @Autowired
    private PurchaseService purchaseService;

    @PostMapping
    public ResponseEntity<Purchase> createPurchase(@Valid @RequestBody Purchase purchase) {
        Purchase response = purchaseService.createPurchase(purchase);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Purchase>> getAllPurchases() {
        List<Purchase> purchases = purchaseService.getAllPurchases();
        return ResponseEntity.ok(purchases);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Purchase> getPurchaseById(@PathVariable Long id) {
        Purchase purchase = purchaseService.getPurchaseById(id);
        return ResponseEntity.ok(purchase);
    }

    @GetMapping("/invoice/{invoiceNumber}")
    public ResponseEntity<Purchase> getPurchaseByInvoiceNumber(@PathVariable String invoiceNumber) {
        Purchase purchase = purchaseService.getPurchaseByInvoiceNumber(invoiceNumber);
        return ResponseEntity.ok(purchase);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Purchase>> getPurchasesByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<Purchase> purchases = purchaseService.getPurchasesByDateRange(startDate, endDate);
        return ResponseEntity.ok(purchases);
    }

    @GetMapping("/date-range/paginated")
    public ResponseEntity<Page<Purchase>> getPurchasesByDateRangePaginated(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            Pageable pageable) {
        Page<Purchase> purchases = purchaseService.getPurchasesByDateRange(startDate, endDate, pageable);
        return ResponseEntity.ok(purchases);
    }

    @GetMapping("/supplier/{supplier}")
    public ResponseEntity<List<Purchase>> getPurchasesBySupplier(@PathVariable String supplier) {
        List<Purchase> purchases = purchaseService.getPurchasesBySupplier(supplier);
        return ResponseEntity.ok(purchases);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Purchase>> getPurchasesByCategory(@PathVariable String category) {
        List<Purchase> purchases = purchaseService.getPurchasesByCategory(category);
        return ResponseEntity.ok(purchases);
    }

    @GetMapping("/supplier/{supplier}/date-range")
    public ResponseEntity<List<Purchase>> getPurchasesBySupplierAndDateRange(
            @PathVariable String supplier,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<Purchase> purchases = purchaseService.getPurchasesBySupplierAndDateRange(supplier, startDate, endDate);
        return ResponseEntity.ok(purchases);
    }

    @GetMapping("/category/{category}/date-range")
    public ResponseEntity<List<Purchase>> getPurchasesByCategoryAndDateRange(
            @PathVariable String category,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<Purchase> purchases = purchaseService.getPurchasesByCategoryAndDateRange(category, startDate, endDate);
        return ResponseEntity.ok(purchases);
    }

    @GetMapping("/total")
    public ResponseEntity<Map<String, BigDecimal>> getTotalPurchaseAmount(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        BigDecimal total = purchaseService.getTotalPurchaseAmount(startDate, endDate);
        return ResponseEntity.ok(Map.of("totalAmount", total));
    }

    @GetMapping("/total/supplier/{supplier}")
    public ResponseEntity<Map<String, BigDecimal>> getTotalAmountBySupplier(@PathVariable String supplier) {
        BigDecimal total = purchaseService.getTotalAmountBySupplier(supplier);
        return ResponseEntity.ok(Map.of("totalAmount", total));
    }

    @GetMapping("/total/category/{category}")
    public ResponseEntity<Map<String, BigDecimal>> getTotalAmountByCategory(@PathVariable String category) {
        BigDecimal total = purchaseService.getTotalAmountByCategory(category);
        return ResponseEntity.ok(Map.of("totalAmount", total));
    }

    @GetMapping("/summary/category")
    public ResponseEntity<Map<String, BigDecimal>> getPurchasesSummaryByCategory(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        Map<String, BigDecimal> summary = purchaseService.getPurchasesSummaryByCategory(startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/summary/supplier")
    public ResponseEntity<Map<String, BigDecimal>> getPurchasesSummaryBySupplier(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        Map<String, BigDecimal> summary = purchaseService.getPurchasesSummaryBySupplier(startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Purchase> updatePurchase(
            @PathVariable Long id,
            @Valid @RequestBody Purchase purchase) {
        Purchase response = purchaseService.updatePurchase(id, purchase);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchase(@PathVariable Long id) {
        purchaseService.deletePurchase(id);
        return ResponseEntity.noContent().build();
    }
}