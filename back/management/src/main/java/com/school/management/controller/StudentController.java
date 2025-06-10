package com.school.management.controller;

import com.school.management.dto.request.StudentCreateRequest;
import com.school.management.dto.request.StudentUpdateRequest;
import com.school.management.dto.response.StudentResponse;
import com.school.management.entity.enums.Language;
import com.school.management.entity.enums.Section;
import com.school.management.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody StudentCreateRequest request) {
        StudentResponse response = studentService.createStudent(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Utilise getAllStudents() sans pagination comme dans le service
    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        List<StudentResponse> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // Nouvelle méthode pour la pagination
    @GetMapping("/paginated")
    public ResponseEntity<Page<StudentResponse>> getAllStudentsPaginated(Pageable pageable) {
        // Utilise getStudentsBySearch avec une chaîne vide pour la pagination
        Page<StudentResponse> students = studentService.getStudentsBySearch("", pageable);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long id) {
        StudentResponse student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentUpdateRequest request) {
        StudentResponse response = studentService.updateStudent(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<StudentResponse>> getStudentsByClass(@PathVariable Long classId) {
        List<StudentResponse> students = studentService.getStudentsByClass(classId);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/section/{section}")
    public ResponseEntity<List<StudentResponse>> getStudentsBySection(@PathVariable Section section) {
        List<StudentResponse> students = studentService.getStudentsBySection(section);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/language/{language}")
    public ResponseEntity<List<StudentResponse>> getStudentsByLanguage(@PathVariable Language language) {
        List<StudentResponse> students = studentService.getStudentsByLanguage(language);
        return ResponseEntity.ok(students);
    }

    // Utilise getStudentsBySearch au lieu de searchStudents
    @GetMapping("/search")
    public ResponseEntity<Page<StudentResponse>> searchStudents(
            @RequestParam(required = false, defaultValue = "") String search,
            Pageable pageable) {
        Page<StudentResponse> students = studentService.getStudentsBySearch(search, pageable);
        return ResponseEntity.ok(students);
    }

    // Méthodes pour les futures fonctionnalités
    @GetMapping("/{id}/payments")
    public ResponseEntity<List<Object>> getStudentPayments(@PathVariable Long id) {
        // This will be implemented when PaymentService is ready
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/grades")
    public ResponseEntity<List<Object>> getStudentGrades(@PathVariable Long id) {
        // This will be implemented when GradeService is ready
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/disciplines")
    public ResponseEntity<List<Object>> getStudentDisciplines(@PathVariable Long id) {
        // This will be implemented when DisciplineService is ready
        return ResponseEntity.ok().build();
    }
}