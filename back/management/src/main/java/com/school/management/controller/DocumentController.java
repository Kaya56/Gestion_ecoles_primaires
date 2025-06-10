package com.school.management.controller;

import com.school.management.entity.Document;
import com.school.management.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "studentId", required = false) Long studentId,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "academicYear", required = false) String academicYear,
            @RequestParam(value = "term", required = false) String term,
            @RequestParam(value = "createdBy", required = false) String createdBy) {

        try {
            Document response = documentService.uploadDocument(file, studentId, documentType,
                    academicYear, term, createdBy);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/upload-simple")
    public ResponseEntity<Document> uploadDocumentSimple(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "studentId", required = false) Long studentId,
            @RequestParam("documentType") String documentType) {

        try {
            Document response = documentService.uploadDocument(file, studentId, documentType);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        List<Document> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        try {
            byte[] documentBytes = documentService.downloadDocument(id);
            Document document = documentService.getDocumentById(id);

            ByteArrayResource resource = new ByteArrayResource(documentBytes);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(document.getMimeType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + document.getName() + "\"")
                    .body(resource);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Document>> getDocumentsByStudent(@PathVariable Long studentId) {
        List<Document> documents = documentService.getDocumentsByStudent(studentId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/type/{documentType}")
    public ResponseEntity<List<Document>> getDocumentsByType(@PathVariable String documentType) {
        List<Document> documents = documentService.getDocumentsByType(documentType);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/academic-year/{academicYear}")
    public ResponseEntity<List<Document>> getDocumentsByAcademicYear(@PathVariable String academicYear) {
        List<Document> documents = documentService.getDocumentsByAcademicYear(academicYear);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/student/{studentId}/type/{documentType}")
    public ResponseEntity<List<Document>> getDocumentsByStudentAndType(
            @PathVariable Long studentId,
            @PathVariable String documentType) {
        List<Document> documents = documentService.getDocumentsByStudentAndType(studentId, documentType);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/created-by/{createdBy}")
    public ResponseEntity<List<Document>> getDocumentsByCreatedBy(@PathVariable String createdBy) {
        List<Document> documents = documentService.getDocumentsByCreatedBy(createdBy);
        return ResponseEntity.ok(documents);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        try {
            documentService.deleteDocument(id);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}