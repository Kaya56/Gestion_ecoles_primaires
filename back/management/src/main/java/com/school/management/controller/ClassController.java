// controller/ClassController.java
package com.school.management.controller;

import com.school.management.entity.Class;
import com.school.management.entity.Student;
import com.school.management.entity.enums.Language;
import com.school.management.entity.enums.Section;
import com.school.management.service.ClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @PostMapping
    public ResponseEntity<Class> createClass(@Valid @RequestBody Class classEntity) {
        Class response = classService.createClass(classEntity);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Class>> getAllClasses() {
        List<Class> classes = classService.getAllClasses();
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Class> getClassById(@PathVariable Long id) {
        Class classEntity = classService.getClassById(id);
        return ResponseEntity.ok(classEntity);
    }

    @GetMapping("/section/{section}")
    public ResponseEntity<List<Class>> getClassesBySection(@PathVariable String section) {
        try {
            Section sectionEnum = Section.valueOf(section.toUpperCase());
            List<Class> classes = classService.getClassesBySection(sectionEnum);
            return ResponseEntity.ok(classes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/language/{language}")
    public ResponseEntity<List<Class>> getClassesByLanguage(@PathVariable String language) {
        try {
            Language languageEnum = Language.valueOf(language.toUpperCase());
            List<Class> classes = classService.getClassesByLanguage(languageEnum);
            return ResponseEntity.ok(classes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<List<Student>> getClassStudents(@PathVariable Long id) {
        List<Student> students = classService.getStudentsByClass(id);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}/statistics")
    public ResponseEntity<Map<String, Object>> getClassStatistics(@PathVariable Long id) {
        Map<String, Object> stats = new HashMap<>();
        long studentCount = classService.getStudentCountByClass(id);
        Class classEntity = classService.getClassById(id);

        stats.put("studentCount", studentCount);
        stats.put("maxCapacity", classEntity.getMaxCapacity());
        stats.put("availableSpots", classEntity.getMaxCapacity() != null ?
                classEntity.getMaxCapacity() - studentCount : null);

        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Class> updateClass(
            @PathVariable Long id,
            @Valid @RequestBody Class classEntity) {
        Class response = classService.updateClass(id, classEntity);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/academic-year/{year}")
    public ResponseEntity<List<Class>> getClassesByAcademicYear(@PathVariable String year) {
        List<Class> classes = classService.getClassesByAcademicYear(year);
        return ResponseEntity.ok(classes);
    }

    @PutMapping("/{classId}/assign-teacher/{teacherId}")
    public ResponseEntity<Class> assignTeacher(
            @PathVariable Long classId,
            @PathVariable Long teacherId) {
        Class updatedClass = classService.assignTeacher(classId, teacherId);
        return ResponseEntity.ok(updatedClass);
    }

    @GetMapping("/section/{section}/language/{language}")
    public ResponseEntity<List<Class>> getClassesBySectionAndLanguage(
            @PathVariable String section,
            @PathVariable String language) {
        try {
            Section sectionEnum = Section.valueOf(section.toUpperCase());
            Language languageEnum = Language.valueOf(language.toUpperCase());
            List<Class> classes = classService.getClassesBySectionAndLanguage(sectionEnum, languageEnum);
            return ResponseEntity.ok(classes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Class>> getClassesByTeacher(@PathVariable Long teacherId) {
        List<Class> classes = classService.getClassesByTeacher(teacherId);
        return ResponseEntity.ok(classes);
    }
}