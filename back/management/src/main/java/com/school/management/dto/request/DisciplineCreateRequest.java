// dto/request/DisciplineCreateRequest.java
package com.school.management.dto.request;

import com.school.management.entity.enums.DisciplineType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DisciplineCreateRequest {
    private Long studentId;
    private DisciplineType type;
    private LocalDate incidentDate;
    private String description;
    private String action;
    private String reportedBy;

    private Boolean resolved = false;
}