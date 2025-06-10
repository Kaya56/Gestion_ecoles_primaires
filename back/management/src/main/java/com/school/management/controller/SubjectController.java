package com.school.management.controller;

import com.school.management.entity.Subject;
import com.school.management.entity.enums.Section;
import com.school.management.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @PostMapping
    public ResponseEntity<Subject> createSubject(@Valid @RequestBody Subject subject) {
        Subject response = subjectService.createSubject(subject);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Utilise getAllSubjects() sans pagination comme dans le service
    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        List<Subject> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long id) {
        Subject subject = subjectService.getSubjectById(id);
        return ResponseEntity.ok(subject);
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Subject>> getSubjectsByTeacher(@PathVariable Long teacherId) {
        List<Subject> subjects = subjectService.getSubjectsByTeacher(teacherId);
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/section/{section}")
    public ResponseEntity<List<Subject>> getSubjectsBySection(@PathVariable Section section) {
        List<Subject> subjects = subjectService.getSubjectsBySection(section);
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Subject>> searchSubjects(
            @RequestParam(required = false, defaultValue = "") String search) {
        List<Subject> subjects = subjectService.searchSubjects(search);
        return ResponseEntity.ok(subjects);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody Subject subject) {
        Subject response = subjectService.updateSubject(id, subject);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }

    // Gestion des enseignants
    @PostMapping("/{subjectId}/teacher/{teacherId}")
    public ResponseEntity<Subject> assignTeacherToSubject(
            @PathVariable Long subjectId,
            @PathVariable Long teacherId) {
        Subject subject = subjectService.assignTeacher(subjectId, teacherId);
        return ResponseEntity.ok(subject);
    }

    @DeleteMapping("/{subjectId}/teacher")
    public ResponseEntity<Subject> removeTeacherFromSubject(@PathVariable Long subjectId) {
        Subject subject = subjectService.removeTeacher(subjectId);
        return ResponseEntity.ok(subject);
    }
}