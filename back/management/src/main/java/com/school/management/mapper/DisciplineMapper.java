// mapper/DisciplineMapper.java
package com.school.management.mapper;

import com.school.management.dto.request.DisciplineCreateRequest;
import com.school.management.dto.response.DisciplineResponse;
import com.school.management.entity.Discipline;
import org.springframework.stereotype.Component;

@Component
public class DisciplineMapper {

    public Discipline toEntity(DisciplineCreateRequest request) {
        Discipline discipline = new Discipline();
        discipline.setType(request.getType());
        discipline.setIncidentDate(request.getIncidentDate());
        discipline.setDescription(request.getDescription());
        discipline.setAction(request.getAction());
        discipline.setReportedBy(request.getReportedBy());
        return discipline;
    }

    public DisciplineResponse toResponse(Discipline discipline) {
        DisciplineResponse response = new DisciplineResponse();
        response.setId(discipline.getId());
        response.setStudentName(discipline.getStudent().getFirstName() + " " + discipline.getStudent().getLastName());
        response.setType(discipline.getType());
        response.setIncidentDate(discipline.getIncidentDate());
        response.setDescription(discipline.getDescription());
        response.setAction(discipline.getAction());
        response.setResolved(discipline.getResolved());
        response.setCreatedAt(discipline.getCreatedAt());
        response.setReportedBy(discipline.getReportedBy());
        return response;
    }
}