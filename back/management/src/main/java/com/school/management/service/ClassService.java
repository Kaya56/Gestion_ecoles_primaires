// service/ClassService.java
package com.school.management.service;

import com.school.management.entity.Class;
import com.school.management.entity.Student;
import com.school.management.entity.Teacher;
import com.school.management.entity.enums.Language;
import com.school.management.entity.enums.Section;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.repository.ClassRepository;
import com.school.management.repository.StudentRepository;
import com.school.management.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClassService {

    private final ClassRepository classRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    public Class createClass(Class classEntity) {
        // Vérification basée sur les champs réels de l'entité
        if (classRepository.existsByNameAndLevelAndSectionAndLanguage(
                classEntity.getName(),
                classEntity.getLevel(),
                classEntity.getSection(),
                classEntity.getLanguage())) {
            throw new IllegalArgumentException("Une classe avec ces caractéristiques existe déjà");
        }
        return classRepository.save(classEntity);
    }

    public Class updateClass(Long id, Class classUpdate) {
        Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée"));

        classEntity.setName(classUpdate.getName());
        classEntity.setLevel(classUpdate.getLevel()); // Nouveau champ
        classEntity.setSection(classUpdate.getSection());
        classEntity.setLanguage(classUpdate.getLanguage()); // Nouveau champ
        classEntity.setMaxCapacity(classUpdate.getMaxCapacity()); // Changé de capacity à maxCapacity
        classEntity.setAcademicYear(classUpdate.getAcademicYear());
        // Note: description n'existe pas dans l'entité

        return classRepository.save(classEntity);
    }

    @Transactional(readOnly = true)
    public Class getClassById(Long id) {
        return classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée"));
    }

    @Transactional(readOnly = true)
    public List<Class> getAllClasses() {
        return classRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Class> getClassesBySection(Section section) {
        return classRepository.findBySection(section);
    }

    @Transactional(readOnly = true)
    public List<Class> getClassesByLanguage(Language language) {
        return classRepository.findByLanguage(language);
    }

    @Transactional(readOnly = true)
    public List<Class> getClassesBySectionAndLanguage(Section section, Language language) {
        return classRepository.findBySectionAndLanguage(section, language);
    }

    @Transactional(readOnly = true)
    public List<Class> getClassesByAcademicYear(String academicYear) {
        return classRepository.findByAcademicYear(academicYear);
    }

    @Transactional(readOnly = true)
    public List<Class> getClassesByTeacher(Long teacherId) {
        return classRepository.findByTeacherId(teacherId);
    }

    @Transactional(readOnly = true)
    public List<Student> getStudentsByClass(Long classId) {
        return studentRepository.findByStudentClassId(classId);
    }

    @Transactional(readOnly = true)
    public long getStudentCountByClass(Long classId) {
        return studentRepository.countByStudentClassId(classId);
    }

    public Class assignTeacher(Long classId, Long teacherId) {
        Class classEntity = getClassById(classId);
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé"));

        classEntity.setTeacher(teacher); // Changé de classTeacher à teacher
        return classRepository.save(classEntity);
    }

    public void deleteClass(Long id) {
        Class classEntity = getClassById(id);
        long studentCount = getStudentCountByClass(id);

        if (studentCount > 0) {
            throw new IllegalStateException("Impossible de supprimer une classe qui contient des élèves");
        }

        classRepository.deleteById(id);
    }
}