// service/DisciplineService.java
package com.school.management.service;

import com.school.management.dto.request.DisciplineCreateRequest;
import com.school.management.dto.response.DisciplineResponse;
import com.school.management.entity.Discipline;
import com.school.management.entity.Student;
import com.school.management.entity.enums.DisciplineType;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.mapper.DisciplineMapper;
import com.school.management.repository.DisciplineRepository;
import com.school.management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DisciplineService {

    private final DisciplineRepository disciplineRepository;
    private final StudentRepository studentRepository;
    private final DisciplineMapper disciplineMapper;

    public DisciplineResponse createDiscipline(DisciplineCreateRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Élève non trouvé"));

        Discipline discipline = disciplineMapper.toEntity(request);
        discipline.setStudent(student);

        // S'assurer que createdAt est défini si pas déjà fait
        if (discipline.getCreatedAt() == null) {
            discipline.setCreatedAt(LocalDate.now());
        }

        Discipline savedDiscipline = disciplineRepository.save(discipline);
        return disciplineMapper.toResponse(savedDiscipline);
    }

    public DisciplineResponse updateDiscipline(Long id, DisciplineCreateRequest request) {
        Discipline discipline = disciplineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident disciplinaire non trouvé"));

        // Mise à jour des champs modifiables
        if (request.getType() != null) {
            discipline.setType(request.getType());
        }
        if (request.getIncidentDate() != null) {
            discipline.setIncidentDate(request.getIncidentDate());
        }
        if (request.getDescription() != null) {
            discipline.setDescription(request.getDescription());
        }
        if (request.getAction() != null) {
            discipline.setAction(request.getAction());
        }
        if (request.getResolved() != null) {
            discipline.setResolved(request.getResolved());
        }
        if (request.getReportedBy() != null) {
            discipline.setReportedBy(request.getReportedBy());
        }

        Discipline updatedDiscipline = disciplineRepository.save(discipline);
        return disciplineMapper.toResponse(updatedDiscipline);
    }

    public DisciplineResponse markAsResolved(Long id, String action) {
        Discipline discipline = disciplineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident disciplinaire non trouvé"));

        discipline.setResolved(true);
        if (action != null && !action.trim().isEmpty()) {
            discipline.setAction(action);
        }

        Discipline updatedDiscipline = disciplineRepository.save(discipline);
        return disciplineMapper.toResponse(updatedDiscipline);
    }

    @Transactional(readOnly = true)
    public DisciplineResponse getDisciplineById(Long id) {
        Discipline discipline = disciplineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident disciplinaire non trouvé"));
        return disciplineMapper.toResponse(discipline);
    }

    @Transactional(readOnly = true)
    public List<DisciplineResponse> getDisciplinesByStudent(Long studentId) {
        return disciplineRepository.findByStudentId(studentId).stream()
                .map(disciplineMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DisciplineResponse> getDisciplinesByStudentAndResolved(Long studentId, Boolean resolved) {
        return disciplineRepository.findByStudentIdAndResolved(studentId, resolved).stream()
                .map(disciplineMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DisciplineResponse> getDisciplinesByType(DisciplineType type) {
        return disciplineRepository.findByType(type).stream()
                .map(disciplineMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DisciplineResponse> getDisciplinesByResolved(Boolean resolved) {
        return disciplineRepository.findByResolved(resolved).stream()
                .map(disciplineMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<DisciplineResponse> getDisciplinesByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return disciplineRepository.findByIncidentDateBetween(startDate, endDate, pageable)
                .map(disciplineMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<DisciplineResponse> getDisciplinesByDateRange(LocalDate startDate, LocalDate endDate) {
        return disciplineRepository.findByIncidentDateBetween(startDate, endDate).stream()
                .map(disciplineMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DisciplineResponse> getAllDisciplines() {
        return disciplineRepository.findAll().stream()
                .map(disciplineMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<DisciplineResponse> getAllDisciplines(Pageable pageable) {
        return disciplineRepository.findAll(pageable)
                .map(disciplineMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public long countDisciplinesByStudent(Long studentId) {
        return disciplineRepository.countByStudentId(studentId);
    }

    @Transactional(readOnly = true)
    public long countUnresolvedDisciplinesByStudent(Long studentId) {
        return disciplineRepository.countByStudentIdAndResolved(studentId, false);
    }

    @Transactional(readOnly = true)
    public List<DisciplineResponse> getRecentDisciplines(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        return disciplineRepository.findByIncidentDateBetween(startDate, LocalDate.now()).stream()
                .map(disciplineMapper::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteDiscipline(Long id) {
        if (!disciplineRepository.existsById(id)) {
            throw new ResourceNotFoundException("Incident disciplinaire non trouvé");
        }
        disciplineRepository.deleteById(id);
    }
}