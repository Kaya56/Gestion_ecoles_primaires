// enums/Section.java
package com.school.management.entity.enums;

public enum Section {
    CRECHE("Crèche"),
    MATERNELLE("Maternelle"),
    PRIMAIRE("Primaire");

    private final String displayName;

    Section(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}