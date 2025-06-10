// mapper/StudentMapper.java
package com.school.management.mapper;

import com.school.management.dto.request.StudentCreateRequest;
import com.school.management.dto.request.StudentUpdateRequest;
import com.school.management.dto.response.StudentResponse;
import com.school.management.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public Student toEntity(StudentCreateRequest request) {
        Student student = new Student();
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setGender(request.getGender());
        student.setSection(request.getSection());
        student.setLanguage(request.getLanguage());
        student.setAcademicYear(request.getAcademicYear());
        student.setParentName(request.getParentName());
        student.setParentPhone(request.getParentPhone());
        student.setParentEmail(request.getParentEmail());
        student.setAddress(request.getAddress());
        return student;
    }

    public void updateEntity(Student student, StudentUpdateRequest request) {
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setGender(request.getGender());
        student.setSection(request.getSection());
        student.setLanguage(request.getLanguage());
        student.setAcademicYear(request.getAcademicYear());
        student.setParentName(request.getParentName());
        student.setParentPhone(request.getParentPhone());
        student.setParentEmail(request.getParentEmail());
        student.setAddress(request.getAddress());
    }

    public StudentResponse toResponse(Student student) {
        StudentResponse response = new StudentResponse();
        response.setId(student.getId());
        response.setFirstName(student.getFirstName());
        response.setLastName(student.getLastName());
        response.setDateOfBirth(student.getDateOfBirth());
        response.setGender(student.getGender());
        response.setSection(student.getSection());
        response.setLanguage(student.getLanguage());
        response.setAcademicYear(student.getAcademicYear());
        response.setParentName(student.getParentName());
        response.setParentPhone(student.getParentPhone());
        response.setParentEmail(student.getParentEmail());
        response.setAddress(student.getAddress());
        response.setClassName(student.getStudentClass() != null ? student.getStudentClass().getName() : null);
        response.setRegistrationDate(student.getRegistrationDate());
        return response;
    }
}