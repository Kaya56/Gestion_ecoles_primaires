// repository/DocumentRepository.java
package com.school.management.repository;

import com.school.management.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByType(String type);
    List<Document> findByStudentId(Long studentId);
    List<Document> findByAcademicYear(String academicYear);
    List<Document> findByStudentIdAndType(Long studentId, String type);
    List<Document> findByCreatedBy(String createdBy);
}