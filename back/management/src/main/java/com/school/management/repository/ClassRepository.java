// repository/ClassRepository.java
package com.school.management.repository;

import com.school.management.entity.Class;
import com.school.management.entity.enums.Language;
import com.school.management.entity.enums.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {

    List<Class> findBySection(Section section);

    List<Class> findByLanguage(Language language);

    List<Class> findByAcademicYear(String academicYear);

    List<Class> findBySectionAndLanguage(Section section, Language language);

    List<Class> findByTeacherId(Long teacherId);

    // Méthode pour vérifier l'existence d'une classe avec des caractéristiques spécifiques
    boolean existsByNameAndLevelAndSectionAndLanguage(
            String name,
            String level,
            Section section,
            Language language
    );

    // Méthodes supplémentaires basées sur l'entité
    List<Class> findByLevel(String level);

    List<Class> findByName(String name);

    List<Class> findByMaxCapacityGreaterThan(Integer capacity);

    @Query("SELECT c FROM Class c WHERE SIZE(c.students) < c.maxCapacity")
    List<Class> findClassesWithAvailableSpots();

    @Query("SELECT c FROM Class c WHERE SIZE(c.students) = :count")
    List<Class> findClassesWithStudentCount(@Param("count") long count);
}