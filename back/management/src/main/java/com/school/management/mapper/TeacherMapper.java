// mapper/TeacherMapper.java
package com.school.management.mapper;

import com.school.management.dto.request.TeacherCreateRequest;
import com.school.management.dto.response.TeacherResponse;
import com.school.management.entity.Teacher;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class TeacherMapper {

    public Teacher toEntity(TeacherCreateRequest request) {
        Teacher teacher = new Teacher();
        teacher.setFirstName(request.getFirstName());
        teacher.setLastName(request.getLastName());
        teacher.setEmail(request.getEmail());
        teacher.setPhone(request.getPhone());
        teacher.setGender(request.getGender());
        teacher.setBirthDate(request.getBirthDate());
        teacher.setHireDate(request.getHireDate());
        teacher.setSpecialization(request.getSpecialization());
        teacher.setTaskDescription(request.getTaskDescription());
        return teacher;
    }

    public TeacherResponse toResponse(Teacher teacher) {
        TeacherResponse response = new TeacherResponse();
        response.setId(teacher.getId());
        response.setFirstName(teacher.getFirstName());
        response.setLastName(teacher.getLastName());
        response.setEmail(teacher.getEmail());
        response.setPhone(teacher.getPhone());
        response.setGender(teacher.getGender());
        response.setBirthDate(teacher.getBirthDate());
        response.setHireDate(teacher.getHireDate());
        response.setSpecialization(teacher.getSpecialization());
        response.setTaskDescription(teacher.getTaskDescription());
        response.setClassNames(teacher.getClasses().stream()
                .map(c -> c.getName())
                .collect(Collectors.toList()));
        return response;
    }

    public void updateEntity(Teacher teacher, TeacherCreateRequest request) {

    }
}