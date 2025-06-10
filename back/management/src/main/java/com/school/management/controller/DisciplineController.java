// controller/DisciplineController.java
package com.school.management.controller;

import com.school.management.dto.request.DisciplineCreateRequest;
import com.school.management.dto.response.DisciplineResponse;
import com.school.management.entity.enums.DisciplineType;
import com.school.management.service.DisciplineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/disciplines")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DisciplineController {

    private final DisciplineService disciplineService;

    @PostMapping
    public ResponseEntity<DisciplineResponse> createDiscipline(@Valid @RequestBody DisciplineCreateRequest request) {
        DisciplineResponse response = disciplineService.createDiscipline(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<DisciplineResponse>> getAllDisciplines(Pageable pageable) {
        Page<DisciplineResponse> disciplines = disciplineService.getAllDisciplines(pageable);
        return ResponseEntity.ok(disciplines);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisciplineResponse> getDisciplineById(@PathVariable Long id) {
        DisciplineResponse discipline = disciplineService.getDisciplineById(id);
        return ResponseEntity.ok(discipline);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<DisciplineResponse>> getDisciplinesByStudent(@PathVariable Long studentId) {
        List<DisciplineResponse> disciplines = disciplineService.getDisciplinesByStudent(studentId);
        return ResponseEntity.ok(disciplines);
    }

    @GetMapping("/student/{studentId}/unresolved")
    public ResponseEntity<List<DisciplineResponse>> getUnresolvedDisciplinesByStudent(@PathVariable Long studentId) {
        List<DisciplineResponse> disciplines = disciplineService.getDisciplinesByStudentAndResolved(studentId, false);
        return ResponseEntity.ok(disciplines);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<DisciplineResponse>> getDisciplinesByType(@PathVariable String type) {
        try {
            DisciplineType disciplineType = DisciplineType.valueOf(type.toUpperCase());
            List<DisciplineResponse> disciplines = disciplineService.getDisciplinesByType(disciplineType);
            return ResponseEntity.ok(disciplines);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<DisciplineResponse>> getDisciplinesByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<DisciplineResponse> disciplines = disciplineService.getDisciplinesByDateRange(startDate, endDate);
        return ResponseEntity.ok(disciplines);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getDisciplineStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Statistiques basiques avec les méthodes disponibles
        List<DisciplineResponse> allDisciplines = disciplineService.getAllDisciplines();
        List<DisciplineResponse> unresolvedDisciplines = disciplineService.getDisciplinesByResolved(false);
        List<DisciplineResponse> recentDisciplines = disciplineService.getRecentDisciplines(30);

        stats.put("totalDisciplines", allDisciplines.size());
        stats.put("unresolvedDisciplines", unresolvedDisciplines.size());
        stats.put("recentDisciplines", recentDisciplines.size());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/student/{studentId}/count")
    public ResponseEntity<Map<String, Long>> getStudentDisciplineCount(@PathVariable Long studentId) {
        Long totalCount = disciplineService.countDisciplinesByStudent(studentId);
        Long unresolvedCount = disciplineService.countUnresolvedDisciplinesByStudent(studentId);

        Map<String, Long> counts = new HashMap<>();
        counts.put("totalCount", totalCount);
        counts.put("unresolvedCount", unresolvedCount);

        return ResponseEntity.ok(counts);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisciplineResponse> updateDiscipline(
            @PathVariable Long id,
            @Valid @RequestBody DisciplineCreateRequest request) {
        DisciplineResponse response = disciplineService.updateDiscipline(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscipline(@PathVariable Long id) {
        disciplineService.deleteDiscipline(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pending-actions")
    public ResponseEntity<List<DisciplineResponse>> getPendingDisciplineActions() {
        List<DisciplineResponse> pendingActions = disciplineService.getDisciplinesByResolved(false);
        return ResponseEntity.ok(pendingActions);
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<DisciplineResponse> resolveDiscipline(
            @PathVariable Long id,
            @RequestParam String action) {
        DisciplineResponse response = disciplineService.markAsResolved(id, action);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/resolved/{resolved}")
    public ResponseEntity<List<DisciplineResponse>> getDisciplinesByResolved(@PathVariable Boolean resolved) {
        List<DisciplineResponse> disciplines = disciplineService.getDisciplinesByResolved(resolved);
        return ResponseEntity.ok(disciplines);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<DisciplineResponse>> getRecentDisciplines(
            @RequestParam(defaultValue = "30") int days) {
        List<DisciplineResponse> disciplines = disciplineService.getRecentDisciplines(days);
        return ResponseEntity.ok(disciplines);
    }

    @GetMapping("/date-range-paginated")
    public ResponseEntity<Page<DisciplineResponse>> getDisciplinesByDateRangePaginated(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            Pageable pageable) {
        Page<DisciplineResponse> disciplines = disciplineService.getDisciplinesByDateRange(startDate, endDate, pageable);
        return ResponseEntity.ok(disciplines);
    }
}