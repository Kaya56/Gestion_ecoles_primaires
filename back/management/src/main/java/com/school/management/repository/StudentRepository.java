// repository/StudentRepository.java
package com.school.management.repository;

import com.school.management.entity.Student;
import com.school.management.entity.enums.Language;
import com.school.management.entity.enums.Section;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findBySection(Section section);
    List<Student> findByLanguage(Language language);
    List<Student> findByAcademicYear(String academicYear);
    List<Student> findBySectionAndLanguage(Section section, Language language);
    List<Student> findByStudentClassId(Long classId);

    @Query("SELECT s FROM Student s WHERE " +
            "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Student> findBySearch(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(s) FROM Student s WHERE s.section = :section AND s.academicYear = :year")
    Long countBySection(@Param("section") Section section, @Param("year") String year);

    long countByStudentClassId(Long classId);
}
