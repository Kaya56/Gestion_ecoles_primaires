// service/PurchaseService.java - Version améliorée
package com.school.management.service;

import com.school.management.entity.Purchase;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;

    public Purchase createPurchase(Purchase purchase) {
        // Validation
        validatePurchase(purchase);

        // Vérifier l'unicité du numéro de facture si fourni
        if (purchase.getInvoiceNumber() != null &&
                purchaseRepository.existsByInvoiceNumber(purchase.getInvoiceNumber())) {
            throw new IllegalArgumentException("Un achat avec ce numéro de facture existe déjà");
        }

        // Le calcul du total se fait automatiquement via @PrePersist
        return purchaseRepository.save(purchase);
    }

    public Purchase updatePurchase(Long id, Purchase purchaseUpdate) {
        validatePurchase(purchaseUpdate);

        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Achat non trouvé"));

        // Vérifier l'unicité du numéro de facture si modifié
        if (purchaseUpdate.getInvoiceNumber() != null &&
                !purchaseUpdate.getInvoiceNumber().equals(purchase.getInvoiceNumber()) &&
                purchaseRepository.existsByInvoiceNumber(purchaseUpdate.getInvoiceNumber())) {
            throw new IllegalArgumentException("Un achat avec ce numéro de facture existe déjà");
        }

        // Mise à jour des champs
        purchase.setItemName(purchaseUpdate.getItemName());
        purchase.setDescription(purchaseUpdate.getDescription());
        purchase.setQuantity(purchaseUpdate.getQuantity());
        purchase.setUnitPrice(purchaseUpdate.getUnitPrice());
        purchase.setSupplier(purchaseUpdate.getSupplier());
        purchase.setCategory(purchaseUpdate.getCategory());
        purchase.setInvoiceNumber(purchaseUpdate.getInvoiceNumber());
        purchase.setPurchaseDate(purchaseUpdate.getPurchaseDate());

        // Le total sera recalculé automatiquement via @PreUpdate
        return purchaseRepository.save(purchase);
    }

    @Transactional(readOnly = true)
    public Purchase getPurchaseById(Long id) {
        return purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Achat non trouvé"));
    }

    @Transactional(readOnly = true)
    public Purchase getPurchaseByInvoiceNumber(String invoiceNumber) {
        Purchase purchase = purchaseRepository.findByInvoiceNumber(invoiceNumber);
        if (purchase == null) {
            throw new ResourceNotFoundException("Achat non trouvé pour le numéro de facture: " + invoiceNumber);
        }
        return purchase;
    }

    @Transactional(readOnly = true)
    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Purchase> getPurchasesByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        validateDateRange(startDate, endDate);
        return purchaseRepository.findByPurchaseDateBetween(startDate, endDate, pageable);
    }

    @Transactional(readOnly = true)
    public List<Purchase> getPurchasesByDateRange(LocalDate startDate, LocalDate endDate) {
        validateDateRange(startDate, endDate);
        return purchaseRepository.findByPurchaseDateBetween(startDate, endDate);
    }

    @Transactional(readOnly = true)
    public List<Purchase> getPurchasesBySupplier(String supplier) {
        if (supplier == null || supplier.trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom du fournisseur ne peut pas être vide");
        }
        return purchaseRepository.findBySupplierContainingIgnoreCase(supplier);
    }

    @Transactional(readOnly = true)
    public List<Purchase> getPurchasesByCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("La catégorie ne peut pas être vide");
        }
        return purchaseRepository.findByCategory(category);
    }

    @Transactional(readOnly = true)
    public List<Purchase> getPurchasesBySupplierAndDateRange(String supplier, LocalDate startDate, LocalDate endDate) {
        validateDateRange(startDate, endDate);
        return purchaseRepository.findBySupplierAndDateRange(supplier, startDate, endDate);
    }

    @Transactional(readOnly = true)
    public List<Purchase> getPurchasesByCategoryAndDateRange(String category, LocalDate startDate, LocalDate endDate) {
        validateDateRange(startDate, endDate);
        return purchaseRepository.findByCategoryAndDateRange(category, startDate, endDate);
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalPurchaseAmount(LocalDate startDate, LocalDate endDate) {
        validateDateRange(startDate, endDate);
        BigDecimal total = purchaseRepository.getTotalAmountByDateRange(startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalAmountBySupplier(String supplier) {
        BigDecimal total = purchaseRepository.getTotalAmountBySupplier(supplier);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalAmountByCategory(String category) {
        BigDecimal total = purchaseRepository.getTotalAmountByCategory(category);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getPurchasesSummaryByCategory(LocalDate startDate, LocalDate endDate) {
        List<Purchase> purchases = getPurchasesByDateRange(startDate, endDate);
        return purchases.stream()
                .collect(Collectors.groupingBy(
                        Purchase::getCategory,
                        Collectors.mapping(
                                Purchase::getTotalAmount,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                        )
                ));
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getPurchasesSummaryBySupplier(LocalDate startDate, LocalDate endDate) {
        List<Purchase> purchases = getPurchasesByDateRange(startDate, endDate);
        return purchases.stream()
                .collect(Collectors.groupingBy(
                        Purchase::getSupplier,
                        Collectors.mapping(
                                Purchase::getTotalAmount,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                        )
                ));
    }

    public void deletePurchase(Long id) {
        if (!purchaseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Achat non trouvé");
        }
        purchaseRepository.deleteById(id);
    }

    // Méthodes utilitaires privées
    private void validatePurchase(Purchase purchase) {
        if (purchase.getItemName() == null || purchase.getItemName().trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom de l'article est obligatoire");
        }
        if (purchase.getQuantity() == null || purchase.getQuantity() <= 0) {
            throw new IllegalArgumentException("La quantité doit être supérieure à zéro");
        }
        if (purchase.getUnitPrice() == null || purchase.getUnitPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le prix unitaire doit être supérieur à zéro");
        }
        if (purchase.getPurchaseDate() == null) {
            purchase.setPurchaseDate(LocalDate.now());
        }
        if (purchase.getPurchaseDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La date d'achat ne peut pas être dans le futur");
        }
    }

    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Les dates de début et de fin sont obligatoires");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("La date de début doit être antérieure à la date de fin");
        }
    }
}
