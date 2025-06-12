package com.school.management.entity.enums;

public enum UserRole {
        TEACHER("Enseignant"),
    ADMIN_STAFF("Personnel Administratif"),
    ACADEMIC_STAFF("Personnel Académique"),
    STUDY_DIRECTOR("Direction des Études");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}