// service/DocumentService.java
package com.school.management.service;

import com.school.management.entity.Document;
import com.school.management.entity.Student;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.repository.DocumentRepository;
import com.school.management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final StudentRepository studentRepository;
    private final String uploadDir = "uploads/documents/";

    public Document uploadDocument(MultipartFile file, Long studentId, String documentType,
                                   String academicYear, String term, String createdBy) throws IOException {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Élève non trouvé"));

        // Créer le répertoire s'il n'existe pas
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Générer un nom de fichier unique
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        // Sauvegarder le fichier
        Files.copy(file.getInputStream(), filePath);

        // Créer l'entité Document
        Document document = new Document();
        document.setName(file.getOriginalFilename()); // Changé de fileName à name
        document.setFilePath(filePath.toString());
        document.setFileSize(file.getSize());
        document.setMimeType(file.getContentType()); // Changé de contentType à mimeType
        document.setType(documentType); // Changé de documentType à type
        document.setStudent(student);
        document.setCreatedAt(LocalDateTime.now()); // Changé de uploadDate à createdAt
        document.setAcademicYear(academicYear);
        document.setTerm(term);
        document.setCreatedBy(createdBy);

        return documentRepository.save(document);
    }

    // Surcharge pour compatibilité avec l'ancienne signature
    public Document uploadDocument(MultipartFile file, Long studentId, String documentType) throws IOException {
        return uploadDocument(file, studentId, documentType, null, null, null);
    }

    @Transactional(readOnly = true)
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé"));
    }

    @Transactional(readOnly = true)
    public List<Document> getDocumentsByStudent(Long studentId) {
        return documentRepository.findByStudentId(studentId);
    }

    @Transactional(readOnly = true)
    public List<Document> getDocumentsByType(String type) { // Changé de documentType à type
        return documentRepository.findByType(type);
    }

    @Transactional(readOnly = true)
    public List<Document> getDocumentsByAcademicYear(String academicYear) {
        return documentRepository.findByAcademicYear(academicYear);
    }

    @Transactional(readOnly = true)
    public List<Document> getDocumentsByStudentAndType(Long studentId, String type) {
        return documentRepository.findByStudentIdAndType(studentId, type);
    }

    @Transactional(readOnly = true)
    public List<Document> getDocumentsByCreatedBy(String createdBy) {
        return documentRepository.findByCreatedBy(createdBy);
    }

    @Transactional(readOnly = true)
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public byte[] downloadDocument(Long id) throws IOException {
        Document document = getDocumentById(id);
        Path filePath = Paths.get(document.getFilePath());

        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("Fichier non trouvé sur le disque");
        }

        return Files.readAllBytes(filePath);
    }

    public void deleteDocument(Long id) throws IOException {
        Document document = getDocumentById(id);

        // Supprimer le fichier du disque
        Path filePath = Paths.get(document.getFilePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        // Supprimer l'enregistrement de la base de données
        documentRepository.delete(document);
    }
}