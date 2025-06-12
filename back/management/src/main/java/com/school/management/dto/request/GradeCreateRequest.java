// dto/request/GradeCreateRequest.java
package com.school.management.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class GradeCreateRequest {
    private Long studentId;
    private Long subjectId;
    private Double score;
    private String term;
    private String academicYear;
    private String examType;
    private LocalDate gradeDate;
    private String comments;
}