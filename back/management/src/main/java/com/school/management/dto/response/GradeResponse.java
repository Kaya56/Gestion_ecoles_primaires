// dto/response/GradeResponse.java
package com.school.management.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class GradeResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long subjectId;
    private String subjectName;
    private Double score;
    private String term;
    private String academicYear;
    private String examType;
    private LocalDate gradeDate;
    private String comments;
}