// dto/request/TeacherCreateRequest.java
package com.school.management.dto.request;

import com.school.management.entity.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TeacherCreateRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Gender gender;
    private LocalDate birthDate;
    private LocalDate hireDate;
    private String specialization;
    private String taskDescription;
}