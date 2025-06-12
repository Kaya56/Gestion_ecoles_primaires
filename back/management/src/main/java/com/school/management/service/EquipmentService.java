// service/EquipmentService.java - Version améliorée
package com.school.management.service;

import com.school.management.entity.Equipment;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;

    public Equipment createEquipment(Equipment equipment) {
        if (equipmentRepository.existsBySerialNumber(equipment.getSerialNumber())) {
            throw new IllegalArgumentException("Un équipement avec ce numéro de série existe déjà");
        }
        return equipmentRepository.save(equipment);
    }

    public Equipment updateEquipment(Long id, Equipment equipmentUpdate) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Équipement non trouvé"));

        // Mise à jour complète de tous les champs
        equipment.setName(equipmentUpdate.getName());
        equipment.setDescription(equipmentUpdate.getDescription());
        equipment.setCategory(equipmentUpdate.getCategory());
        equipment.setBrand(equipmentUpdate.getBrand());
        equipment.setModel(equipmentUpdate.getModel());
        equipment.setPurchasePrice(equipmentUpdate.getPurchasePrice());
        equipment.setPurchaseDate(equipmentUpdate.getPurchaseDate());
        equipment.setWarrantyExpiryDate(equipmentUpdate.getWarrantyExpiryDate());
        equipment.setLocation(equipmentUpdate.getLocation());
        equipment.setStatus(equipmentUpdate.getStatus());
        equipment.setMaintenanceDate(equipmentUpdate.getMaintenanceDate());
        equipment.setAssignedTo(equipmentUpdate.getAssignedTo());

        // Note: Le serialNumber n'est pas mis à jour pour éviter les conflits

        return equipmentRepository.save(equipment);
    }

    @Transactional(readOnly = true)
    public Equipment getEquipmentById(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Équipement non trouvé"));
    }

    @Transactional(readOnly = true)
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Equipment> getEquipmentByCategory(String category) {
        return equipmentRepository.findByCategory(category);
    }

    @Transactional(readOnly = true)
    public List<Equipment> getEquipmentByStatus(String status) {
        return equipmentRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Equipment> getEquipmentByLocation(String location) {
        return equipmentRepository.findByLocation(location);
    }

    @Transactional(readOnly = true)
    public List<Equipment> getEquipmentByAssignedTo(String assignedTo) {
        return equipmentRepository.findByAssignedTo(assignedTo);
    }

    @Transactional(readOnly = true)
    public List<Equipment> getEquipmentNeedingMaintenance() {
        LocalDate today = LocalDate.now();
        return equipmentRepository.findByMaintenanceDateBefore(today);
    }

    public void deleteEquipment(Long id) {
        if (!equipmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Équipement non trouvé");
        }
        equipmentRepository.deleteById(id);
    }

    // Méthodes supplémentaires utiles
    @Transactional(readOnly = true)
    public Equipment getEquipmentBySerialNumber(String serialNumber) {
        return equipmentRepository.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Équipement non trouvé"));
    }

    @Transactional(readOnly = true)
    public List<Equipment> getEquipmentUnderWarranty() {
        LocalDate today = LocalDate.now();
        return equipmentRepository.findAll().stream()
                .filter(eq -> eq.getWarrantyExpiryDate() != null &&
                        eq.getWarrantyExpiryDate().isAfter(today))
                .toList();
    }
}