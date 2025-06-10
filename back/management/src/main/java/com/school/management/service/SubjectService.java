// service/SubjectService.java
package com.school.management.service;

import com.school.management.entity.Subject;
import com.school.management.entity.Teacher;
import com.school.management.entity.enums.Section;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.repository.SubjectRepository;
import com.school.management.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;

    public Subject createSubject(Subject subject) {
        if (subjectRepository.existsByNameAndSection(subject.getName(), subject.getSection())) {
            throw new IllegalArgumentException("Une matière avec ce nom existe déjà dans cette section");
        }
        return subjectRepository.save(subject);
    }

    public Subject updateSubject(Long id, Subject subjectUpdate) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Matière non trouvée"));

        subject.setName(subjectUpdate.getName());
        subject.setCode(subjectUpdate.getCode());
        subject.setDescription(subjectUpdate.getDescription());
        subject.setCredits(subjectUpdate.getCredits());
        subject.setSection(subjectUpdate.getSection());
        subject.setLanguage(subjectUpdate.getLanguage());
        subject.setLevel(subjectUpdate.getLevel());
        subject.setCoefficient(subjectUpdate.getCoefficient());

        return subjectRepository.save(subject);
    }

    @Transactional(readOnly = true)
    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Matière non trouvée"));
    }

    @Transactional(readOnly = true)
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Subject> getSubjectsBySection(Section section) {
        return subjectRepository.findBySection(section);
    }

    @Transactional(readOnly = true)
    public List<Subject> getSubjectsByTeacher(Long teacherId) {
        return subjectRepository.findByTeacherId(teacherId);
    }

    @Transactional(readOnly = true)
    public List<Subject> searchSubjects(String search) {
        return subjectRepository.findBySearch(search);
    }

    public Subject assignTeacher(Long subjectId, Long teacherId) {
        Subject subject = getSubjectById(subjectId);
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé"));

        subject.setTeacher(teacher);
        return subjectRepository.save(subject);
    }

    public Subject removeTeacher(Long subjectId) {
        Subject subject = getSubjectById(subjectId);
        subject.setTeacher(null);
        return subjectRepository.save(subject);
    }

    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Matière non trouvée");
        }
        subjectRepository.deleteById(id);
    }
}