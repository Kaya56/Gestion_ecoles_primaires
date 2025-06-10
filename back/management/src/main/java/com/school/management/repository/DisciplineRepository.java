// repository/DisciplineRepository.java
package com.school.management.repository;

import com.school.management.entity.Discipline;
import com.school.management.entity.enums.DisciplineType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DisciplineRepository extends JpaRepository<Discipline, Long> {

    List<Discipline> findByStudentId(Long studentId);

    List<Discipline> findByType(DisciplineType type);

    List<Discipline> findByResolved(Boolean resolved);

    List<Discipline> findByIncidentDateBetween(LocalDate startDate, LocalDate endDate);

    Page<Discipline> findByIncidentDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    List<Discipline> findByStudentIdAndResolved(Long studentId, Boolean resolved);

    long countByStudentId(Long studentId);

    long countByStudentIdAndResolved(Long studentId, Boolean resolved);

    // Méthodes supplémentaires utiles
    List<Discipline> findByReportedBy(String reportedBy);

    List<Discipline> findByCreatedAtBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT d FROM Discipline d WHERE d.student.id = :studentId AND d.incidentDate BETWEEN :startDate AND :endDate")
    List<Discipline> findByStudentIdAndIncidentDateBetween(
            @Param("studentId") Long studentId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COUNT(d) FROM Discipline d WHERE d.resolved = false")
    long countUnresolvedDisciplines();

    @Query("SELECT d FROM Discipline d WHERE d.resolved = false ORDER BY d.incidentDate DESC")
    List<Discipline> findUnresolvedDisciplinesOrderByIncidentDateDesc();

    @Query("SELECT d FROM Discipline d WHERE d.type = :type AND d.resolved = :resolved")
    List<Discipline> findByTypeAndResolved(@Param("type") DisciplineType type, @Param("resolved") Boolean resolved);

    @Query("SELECT d FROM Discipline d WHERE d.incidentDate >= :date ORDER BY d.incidentDate DESC")
    List<Discipline> findRecentDisciplines(@Param("date") LocalDate date);
}