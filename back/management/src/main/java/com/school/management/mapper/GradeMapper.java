// mapper/GradeMapper.java
package com.school.management.mapper;

import com.school.management.dto.request.GradeCreateRequest;
import com.school.management.dto.response.GradeResponse;
import com.school.management.entity.Grade;
import com.school.management.entity.Student;
import com.school.management.entity.Subject;
import com.school.management.repository.StudentRepository;
import com.school.management.repository.SubjectRepository;
import com.school.management.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class GradeMapper {

    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    public Grade toEntity(GradeCreateRequest request) {
        Grade grade = new Grade();

        // Conversion Double vers BigDecimal pour la précision
        if (request.getScore() != null) {
            grade.setValue(BigDecimal.valueOf(request.getScore()));
        }

        // Utilisation des noms corrects des champs de l'entité
        grade.setSemester(request.getTerm()); // term -> semester
        grade.setAcademicYear(request.getAcademicYear());
        grade.setExamType(request.getExamType());
        grade.setGradeDate(request.getGradeDate());
        grade.setComments(request.getComments());

        // Récupération des entités liées via les repositories
        if (request.getStudentId() != null) {
            Student student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Élève non trouvé"));
            grade.setStudent(student);
        }

        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Matière non trouvée"));
            grade.setSubject(subject);
        }

        return grade;
    }

    public GradeResponse toResponse(Grade grade) {
        GradeResponse response = new GradeResponse();
        response.setId(grade.getId());

        // Gestion sécurisée des relations
        if (grade.getStudent() != null) {
            response.setStudentId(grade.getStudent().getId());
            response.setStudentName(grade.getStudent().getFirstName() + " " + grade.getStudent().getLastName());
        }

        if (grade.getSubject() != null) {
            response.setSubjectId(grade.getSubject().getId());
            response.setSubjectName(grade.getSubject().getName());
        }

        // Conversion BigDecimal vers Double pour la réponse
        if (grade.getValue() != null) {
            response.setScore(grade.getValue().doubleValue());
        }

        // Mapping des champs avec les bons noms
        response.setTerm(grade.getSemester()); // semester -> term dans la réponse
        response.setAcademicYear(grade.getAcademicYear());
        response.setExamType(grade.getExamType());
        response.setGradeDate(grade.getGradeDate());
        response.setComments(grade.getComments());

        return response;
    }

    public void updateEntity(Grade grade, GradeCreateRequest request) {
        if (request.getScore() != null) {
            grade.setValue(BigDecimal.valueOf(request.getScore()));
        }
        if (request.getTerm() != null) {
            grade.setSemester(request.getTerm());
        }
        if (request.getAcademicYear() != null) {
            grade.setAcademicYear(request.getAcademicYear());
        }
        if (request.getExamType() != null) {
            grade.setExamType(request.getExamType());
        }
        if (request.getGradeDate() != null) {
            grade.setGradeDate(request.getGradeDate());
        }
        if (request.getComments() != null) {
            grade.setComments(request.getComments());
        }

        // Mise à jour des relations si nécessaire
        if (request.getStudentId() != null) {
            Student student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Élève non trouvé"));
            grade.setStudent(student);
        }

        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Matière non trouvée"));
            grade.setSubject(subject);
        }
    }
}