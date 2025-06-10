package com.school.management.repository;

import com.school.management.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findBySubjectId(Long subjectId);
    List<Grade> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
    List<Grade> findByStudentIdAndSemester(Long studentId, String semester);
    List<Grade> findBySubjectIdAndSemester(Long subjectId, String semester);
    List<Grade> findByStudentIdAndAcademicYear(Long studentId, String academicYear);

    @Query("SELECT g FROM Grade g WHERE g.student.id = :studentId AND g.semester = :semester AND g.academicYear = :year")
    List<Grade> findStudentGradesBySemesterAndYear(@Param("studentId") Long studentId,
                                                   @Param("semester") String semester,
                                                   @Param("year") String academicYear);

    @Query("SELECT g FROM Grade g WHERE g.student.id = :studentId AND g.subject.id = :subjectId AND g.semester = :semester")
    List<Grade> findByStudentIdAndSubjectIdAndSemester(@Param("studentId") Long studentId,
                                                       @Param("subjectId") Long subjectId,
                                                       @Param("semester") String semester);
}