// service/GradeService.java
package com.school.management.service;

import com.school.management.dto.request.GradeCreateRequest;
import com.school.management.dto.response.GradeResponse;
import com.school.management.entity.Grade;
import com.school.management.entity.Student;
import com.school.management.entity.Subject;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.mapper.GradeMapper;
import com.school.management.repository.GradeRepository;
import com.school.management.repository.StudentRepository;
import com.school.management.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GradeService {

    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final GradeMapper gradeMapper;

    public GradeResponse createGrade(GradeCreateRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Élève non trouvé"));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Matière non trouvée"));

        Grade grade = gradeMapper.toEntity(request);
        grade.setStudent(student);
        grade.setSubject(subject);

        Grade savedGrade = gradeRepository.save(grade);
        return gradeMapper.toResponse(savedGrade);
    }

    public GradeResponse updateGrade(Long id, GradeCreateRequest request) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note non trouvée"));

        gradeMapper.updateEntity(grade, request);

        Grade updatedGrade = gradeRepository.save(grade);
        return gradeMapper.toResponse(updatedGrade);
    }

    @Transactional(readOnly = true)
    public GradeResponse getGradeById(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note non trouvée"));
        return gradeMapper.toResponse(grade);
    }

    @Transactional(readOnly = true)
    public List<GradeResponse> getGradesByStudent(Long studentId) {
        return gradeRepository.findByStudentId(studentId).stream()
                .map(gradeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GradeResponse> getGradesBySubject(Long subjectId) {
        return gradeRepository.findBySubjectId(subjectId).stream()
                .map(gradeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GradeResponse> getGradesByStudentAndSubject(Long studentId, Long subjectId) {
        return gradeRepository.findByStudentIdAndSubjectId(studentId, subjectId).stream()
                .map(gradeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateAverageByStudent(Long studentId, String semester) {
        List<Grade> grades = gradeRepository.findByStudentIdAndSemester(studentId, semester);
        if (grades.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal sum = grades.stream()
                .map(Grade::getValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return sum.divide(BigDecimal.valueOf(grades.size()), 2, RoundingMode.HALF_UP);
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateAverageBySubject(Long subjectId, String semester) {
        List<Grade> grades = gradeRepository.findBySubjectIdAndSemester(subjectId, semester);
        if (grades.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal sum = grades.stream()
                .map(Grade::getValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return sum.divide(BigDecimal.valueOf(grades.size()), 2, RoundingMode.HALF_UP);
    }

    public void deleteGrade(Long id) {
        if (!gradeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Note non trouvée");
        }
        gradeRepository.deleteById(id);
    }
}