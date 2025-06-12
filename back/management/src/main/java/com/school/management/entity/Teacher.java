// entity/Teacher.java
package com.school.management.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.school.management.entity.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teachers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true)
    private String email;

    private String phone;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private LocalDate birthDate;
    private LocalDate hireDate;
    private String specialization;

    @Column(columnDefinition = "TEXT")
    private String taskDescription;

    // Matières où cet enseignant est le principal
    @OneToMany(mappedBy = "teacher", fetch = FetchType.LAZY)
    @JsonManagedReference // Gère la sérialisation vers Class
    private List<Subject> primarySubjects = new ArrayList<>();

    @OneToMany(mappedBy = "teacher", fetch = FetchType.LAZY)
    private List<Class> classes = new ArrayList<>();

    @ManyToMany(mappedBy = "teachers")
    private List<Subject> subjects = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}