package com.augusto.login_system.common;

import java.util.Locale;

public final class EmailNormalizer {

    private EmailNormalizer() {}

    public static String normalize(String email) {
        if (email == null) return null;
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
