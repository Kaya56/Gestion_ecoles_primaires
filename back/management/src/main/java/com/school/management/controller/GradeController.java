package com.school.management.controller;

import com.school.management.dto.request.GradeCreateRequest;
import com.school.management.dto.response.GradeResponse;
import com.school.management.service.GradeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "*")
public class GradeController {

    @Autowired
    private GradeService gradeService;

    @PostMapping
    public ResponseEntity<GradeResponse> createGrade(@Valid @RequestBody GradeCreateRequest request) {
        GradeResponse response = gradeService.createGrade(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GradeResponse> getGradeById(@PathVariable Long id) {
        GradeResponse grade = gradeService.getGradeById(id);
        return ResponseEntity.ok(grade);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<GradeResponse>> getGradesByStudent(@PathVariable Long studentId) {
        List<GradeResponse> grades = gradeService.getGradesByStudent(studentId);
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<GradeResponse>> getGradesBySubject(@PathVariable Long subjectId) {
        List<GradeResponse> grades = gradeService.getGradesBySubject(subjectId);
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/student/{studentId}/subject/{subjectId}")
    public ResponseEntity<List<GradeResponse>> getGradesByStudentAndSubject(
            @PathVariable Long studentId,
            @PathVariable Long subjectId) {
        List<GradeResponse> grades = gradeService.getGradesByStudentAndSubject(studentId, subjectId);
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/student/{studentId}/average")
    public ResponseEntity<Map<String, BigDecimal>> getStudentAverage(
            @PathVariable Long studentId,
            @RequestParam(required = false) String semester) {
        BigDecimal average = gradeService.calculateAverageByStudent(studentId, semester);
        return ResponseEntity.ok(Map.of("average", average));
    }

    @GetMapping("/subject/{subjectId}/average")
    public ResponseEntity<Map<String, BigDecimal>> getSubjectAverage(
            @PathVariable Long subjectId,
            @RequestParam(required = false) String semester) {
        BigDecimal average = gradeService.calculateAverageBySubject(subjectId, semester);
        return ResponseEntity.ok(Map.of("average", average));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GradeResponse> updateGrade(
            @PathVariable Long id,
            @Valid @RequestBody GradeCreateRequest request) {
        GradeResponse response = gradeService.updateGrade(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id) {
        gradeService.deleteGrade(id);
        return ResponseEntity.noContent().build();
    }
}