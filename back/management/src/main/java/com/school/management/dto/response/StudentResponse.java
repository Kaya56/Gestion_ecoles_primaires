// dto/response/StudentResponse.java
package com.school.management.dto.response;

import com.school.management.entity.enums.Gender;
import com.school.management.entity.enums.Language;
import com.school.management.entity.enums.Section;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private Section section;
    private Language language;
    private String academicYear;
    private String parentName;
    private String parentPhone;
    private String parentEmail;
    private String address;
    private String className;
    private LocalDate registrationDate;
}