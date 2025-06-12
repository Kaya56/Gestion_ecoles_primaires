package com.school.management.controller;

import com.school.management.dto.request.TeacherCreateRequest;
import com.school.management.dto.response.TeacherResponse;
import com.school.management.service.TeacherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "*")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @PostMapping
    public ResponseEntity<TeacherResponse> createTeacher(@Valid @RequestBody TeacherCreateRequest request) {
        TeacherResponse response = teacherService.createTeacher(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Utilise getAllTeachers() sans pagination comme dans le service
    @GetMapping
    public ResponseEntity<List<TeacherResponse>> getAllTeachers() {
        List<TeacherResponse> teachers = teacherService.getAllTeachers();
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherResponse> getTeacherById(@PathVariable Long id) {
        TeacherResponse teacher = teacherService.getTeacherById(id);
        return ResponseEntity.ok(teacher);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<TeacherResponse> getTeacherByEmail(@PathVariable String email) {
        TeacherResponse teacher = teacherService.getTeacherByEmail(email);
        return ResponseEntity.ok(teacher);
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<TeacherResponse>> getTeachersBySpecialization(@PathVariable String specialization) {
        List<TeacherResponse> teachers = teacherService.getTeachersBySpecialization(specialization);
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TeacherResponse>> searchTeachers(
            @RequestParam(required = false, defaultValue = "") String search) {
        List<TeacherResponse> teachers = teacherService.searchTeachers(search);
        return ResponseEntity.ok(teachers);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherResponse> updateTeacher(
            @PathVariable Long id,
            @Valid @RequestBody TeacherCreateRequest request) {
        TeacherResponse response = teacherService.updateTeacher(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }

    // Méthodes pour les futures fonctionnalités
    @GetMapping("/{id}/classes")
    public ResponseEntity<List<Object>> getTeacherClasses(@PathVariable Long id) {
        // Will be implemented with ClassService
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/subjects")
    public ResponseEntity<List<Object>> getTeacherSubjects(@PathVariable Long id) {
        // Will be implemented with SubjectService
        return ResponseEntity.ok().build();
    }
}