// repository/SubjectRepository.java
package com.school.management.repository;

import com.school.management.entity.Subject;
import com.school.management.entity.enums.Language;
import com.school.management.entity.enums.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findBySection(Section section);
    List<Subject> findByLanguage(Language language);
    List<Subject> findBySectionAndLanguage(Section section, Language language);
    List<Subject> findByLevel(String level);

    // Méthodes ajoutées pour le service
    boolean existsByNameAndSection(String name, Section section);
    List<Subject> findByTeacherId(Long teacherId);

    @Query("SELECT s FROM Subject s WHERE " +
            "LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(s.code) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Subject> findBySearch(@Param("search") String search);
}