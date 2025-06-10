package com.school.management.entity.enums;

public enum PaymentMode {
    CASH("Espèces"),
    BANK_TRANSFER("Virement bancaire"),
    MOBILE_MONEY("Mobile Money"),
    CHECK("Chèque");

    private final String displayName;

    PaymentMode(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}