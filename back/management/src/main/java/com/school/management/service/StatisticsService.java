package com.school.management.service;

// src/main/java/com/school/management/service/StatisticsService.java

import com.school.management.entity.enums.Section;
import com.school.management.repository.ClassRepository;
import com.school.management.repository.StudentRepository;
import com.school.management.repository.SubjectRepository;
import com.school.management.repository.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class StatisticsService {

    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;

    public StatisticsService(
            ClassRepository classRepository,
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            SubjectRepository subjectRepository) {
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.subjectRepository = subjectRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalClasses", classRepository.count());
        statistics.put("totalStudents", studentRepository.count());
        statistics.put("totalTeachers", teacherRepository.count());
        statistics.put("totalSubjects", subjectRepository.count());

        Map<String, Long> classesBySection = new HashMap<>();
        classesBySection.put("creche", classRepository.findBySection(Section.CRECHE).stream().count());
        classesBySection.put("maternelle", classRepository.findBySection(Section.MATERNELLE).stream().count());
        classesBySection.put("primaire", classRepository.findBySection(Section.PRIMAIRE).stream().count());
        statistics.put("classesBySection", classesBySection);

        return statistics;
    }
}