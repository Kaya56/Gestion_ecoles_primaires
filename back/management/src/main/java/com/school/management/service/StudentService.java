// service/StudentService.java
package com.school.management.service;

import com.school.management.dto.request.StudentCreateRequest;
import com.school.management.dto.request.StudentUpdateRequest;
import com.school.management.dto.response.StudentResponse;
import com.school.management.entity.Class;
import com.school.management.entity.Student;
import com.school.management.entity.enums.Language;
import com.school.management.entity.enums.Section;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.mapper.StudentMapper;
import com.school.management.repository.ClassRepository;
import com.school.management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final ClassRepository classRepository;
    private final StudentMapper studentMapper;

    public StudentResponse createStudent(StudentCreateRequest request) {
        Student student = studentMapper.toEntity(request);

        if (request.getClassId() != null) {
            Class studentClass = classRepository.findById(request.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée"));
            student.setStudentClass(studentClass);
        }

        Student savedStudent = studentRepository.save(student);
        return studentMapper.toResponse(savedStudent);
    }

    public StudentResponse updateStudent(Long id, StudentUpdateRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Élève non trouvé"));

        studentMapper.updateEntity(student, request);

        if (request.getClassId() != null) {
            Class studentClass = classRepository.findById(request.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée"));
            student.setStudentClass(studentClass);
        }

        Student updatedStudent = studentRepository.save(student);
        return studentMapper.toResponse(updatedStudent);
    }

    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Élève non trouvé"));
        return studentMapper.toResponse(student);
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(studentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<StudentResponse> getStudentsBySearch(String search, Pageable pageable) {
        return studentRepository.findBySearch(search, pageable)
                .map(studentMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> getStudentsBySection(Section section) {
        return studentRepository.findBySection(section).stream()
                .map(studentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> getStudentsByLanguage(Language language) {
        return studentRepository.findByLanguage(language).stream()
                .map(studentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> getStudentsByClass(Long classId) {
        return studentRepository.findByStudentClassId(classId).stream()
                .map(studentMapper::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Élève non trouvé");
        }
        studentRepository.deleteById(id);
    }
}