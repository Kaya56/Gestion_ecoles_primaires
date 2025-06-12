package com.school.management.controller;

import com.school.management.entity.Staff;
import com.school.management.entity.enums.UserRole;
import com.school.management.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @PostMapping
    public ResponseEntity<Staff> createStaff(@Valid @RequestBody Staff staff) {
        Staff response = staffService.createStaff(staff);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Utilise getAllStaff() sans pagination comme dans le service
    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff() {
        List<Staff> staff = staffService.getAllStaff();
        return ResponseEntity.ok(staff);
    }

    // Nouvelle méthode pour la pagination si nécessaire
    @GetMapping("/paginated")
    public ResponseEntity<Page<Staff>> getAllStaffPaginated(Pageable pageable) {
        // Cette méthode nécessiterait d'ajouter getAllStaff(Pageable) dans le service
        // ou utiliser getStaffBySearch avec une chaîne vide
        Page<Staff> staff = staffService.getStaffBySearch("", pageable);
        return ResponseEntity.ok(staff);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Long id) {
        Staff staff = staffService.getStaffById(id);
        return ResponseEntity.ok(staff);
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Staff>> getStaffByDepartment(@PathVariable String department) {
        List<Staff> staff = staffService.getStaffByDepartment(department);
        return ResponseEntity.ok(staff);
    }

    @GetMapping("/position/{position}")
    public ResponseEntity<List<Staff>> getStaffByPosition(@PathVariable String position) {
        List<Staff> staff = staffService.getStaffByPosition(position);
        return ResponseEntity.ok(staff);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<Staff>> getStaffByRole(@PathVariable UserRole role) {
        List<Staff> staff = staffService.getStaffByRole(role);
        return ResponseEntity.ok(staff);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Staff> getStaffByEmail(@PathVariable String email) {
        Staff staff = staffService.getStaffByEmail(email);
        return ResponseEntity.ok(staff);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(
            @PathVariable Long id,
            @Valid @RequestBody Staff staff) {
        Staff response = staffService.updateStaff(id, staff);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }

    // Utilise la méthode getStaffBySearch du service au lieu de searchStaff
    @GetMapping("/search")
    public ResponseEntity<Page<Staff>> searchStaff(
            @RequestParam(required = false, defaultValue = "") String search,
            Pageable pageable) {
        Page<Staff> staff = staffService.getStaffBySearch(search, pageable);
        return ResponseEntity.ok(staff);
    }
}