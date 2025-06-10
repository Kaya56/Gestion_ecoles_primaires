package com.school.management.entity.enums;

public enum DisciplineType {
    BLAME("Blâme"),
    CONVOCATION("Convocation");

    private final String displayName;

    DisciplineType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}