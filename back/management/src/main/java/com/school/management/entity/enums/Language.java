package com.school.management.entity.enums;

public enum Language {
    FRANCOPHONE("Francophone"),
    ANGLOPHONE("Anglophone");

    private final String displayName;

    Language(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}