// repository/EquipmentRepository.java - Version corrigée
package com.school.management.repository;

import com.school.management.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    Optional<Equipment> findBySerialNumber(String serialNumber);
    boolean existsBySerialNumber(String serialNumber); // AJOUTÉ
    List<Equipment> findByCategory(String category);
    List<Equipment> findByStatus(String status);
    List<Equipment> findByLocation(String location);
    List<Equipment> findByAssignedTo(String assignedTo);
    List<Equipment> findByMaintenanceDateBefore(LocalDate date); // AJOUTÉ
}