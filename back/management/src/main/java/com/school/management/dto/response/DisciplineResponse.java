// dto/response/DisciplineResponse.java
package com.school.management.dto.response;

import com.school.management.entity.enums.DisciplineType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DisciplineResponse {
    private Long id;
    private String studentName;
    private DisciplineType type;
    private LocalDate incidentDate;
    private String description;
    private String action;
    private Boolean resolved;
    private LocalDate createdAt;
    private String reportedBy;
}