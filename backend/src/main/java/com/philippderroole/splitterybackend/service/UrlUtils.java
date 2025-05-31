package com.philippderroole.splitterybackend.service;

import java.util.Base64;
import java.util.UUID;

public final class UrlUtils {

    private UrlUtils() {
    }

    /**
     * Generates a unique Base64 that is safe for use in URLs.
     */
    public static String generateUrl(int length) {
        UUID uuid = UUID.randomUUID();
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(uuid.toString().getBytes())
                .substring(0, length);
    }
}
