// dto/response/TeacherResponse.java
package com.school.management.dto.response;

import com.school.management.entity.enums.Gender;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TeacherResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Gender gender;
    private LocalDate birthDate;
    private LocalDate hireDate;
    private String specialization;
    private String taskDescription;
    private List<String> classNames;
}