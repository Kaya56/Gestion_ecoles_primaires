// service/TeacherService.java
package com.school.management.service;

import com.school.management.dto.request.TeacherCreateRequest;
import com.school.management.dto.response.TeacherResponse;
import com.school.management.entity.Teacher;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.mapper.TeacherMapper;
import com.school.management.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final TeacherMapper teacherMapper;

    public TeacherResponse createTeacher(TeacherCreateRequest request) {
        Teacher teacher = teacherMapper.toEntity(request);
        Teacher savedTeacher = teacherRepository.save(teacher);
        return teacherMapper.toResponse(savedTeacher);
    }

    public TeacherResponse updateTeacher(Long id, TeacherCreateRequest request) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé"));

        teacherMapper.updateEntity(teacher, request);
        Teacher updatedTeacher = teacherRepository.save(teacher);
        return teacherMapper.toResponse(updatedTeacher);
    }

    @Transactional(readOnly = true)
    public TeacherResponse getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé"));
        return teacherMapper.toResponse(teacher);
    }

    @Transactional(readOnly = true)
    public Teacher getTeacherEntityById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé"));
    }

    @Transactional(readOnly = true)
    public List<TeacherResponse> getAllTeachers() {
        return teacherRepository.findAll().stream()
                .map(teacherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TeacherResponse> searchTeachers(String search) {
        return teacherRepository.findBySearch(search).stream()
                .map(teacherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TeacherResponse> getTeachersBySpecialization(String specialization) {
        return teacherRepository.findBySpecialization(specialization).stream()
                .map(teacherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeacherResponse getTeacherByEmail(String email) {
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé avec cet email"));
        return teacherMapper.toResponse(teacher);
    }

    public void deleteTeacher(Long id) {
        if (!teacherRepository.existsById(id)) {
            throw new ResourceNotFoundException("Enseignant non trouvé");
        }
        teacherRepository.deleteById(id);
    }
}