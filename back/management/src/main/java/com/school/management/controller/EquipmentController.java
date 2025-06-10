package com.school.management.controller;

import com.school.management.entity.Equipment;
import com.school.management.service.EquipmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "*")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    @PostMapping
    public ResponseEntity<Equipment> createEquipment(@Valid @RequestBody Equipment equipment) {
        Equipment response = equipmentService.createEquipment(equipment);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Equipment>> getAllEquipment() {
        List<Equipment> equipment = equipmentService.getAllEquipment();
        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable Long id) {
        Equipment equipment = equipmentService.getEquipmentById(id);
        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/serial/{serialNumber}")
    public ResponseEntity<Equipment> getEquipmentBySerialNumber(@PathVariable String serialNumber) {
        Equipment equipment = equipmentService.getEquipmentBySerialNumber(serialNumber);
        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Equipment>> getEquipmentByCategory(@PathVariable String category) {
        List<Equipment> equipment = equipmentService.getEquipmentByCategory(category);
        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<Equipment>> getEquipmentByLocation(@PathVariable String location) {
        List<Equipment> equipment = equipmentService.getEquipmentByLocation(location);
        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Equipment>> getEquipmentByStatus(@PathVariable String status) {
        List<Equipment> equipment = equipmentService.getEquipmentByStatus(status);
        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/assigned-to/{assignedTo}")
    public ResponseEntity<List<Equipment>> getEquipmentByAssignedTo(@PathVariable String assignedTo) {
        List<Equipment> equipment = equipmentService.getEquipmentByAssignedTo(assignedTo);
        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/maintenance-due")
    public ResponseEntity<List<Equipment>> getEquipmentNeedingMaintenance() {
        List<Equipment> equipment = equipmentService.getEquipmentNeedingMaintenance();
        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/under-warranty")
    public ResponseEntity<List<Equipment>> getEquipmentUnderWarranty() {
        List<Equipment> equipment = equipmentService.getEquipmentUnderWarranty();
        return ResponseEntity.ok(equipment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipment> updateEquipment(
            @PathVariable Long id,
            @Valid @RequestBody Equipment equipment) {
        Equipment response = equipmentService.updateEquipment(id, equipment);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }
}