// dto/request/StudentUpdateRequest.java
package com.school.management.dto.request;

import com.school.management.entity.enums.Gender;
import com.school.management.entity.enums.Language;
import com.school.management.entity.enums.Section;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentUpdateRequest {
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
    private Long classId;
}
