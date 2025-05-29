package com.philippderroole.splitterybackend.dtos.auth;

public class JwtTokenDto {

    private String accessToken;

    private JwtTokenDto(String accessToken) {
        this.accessToken = accessToken;
    }

    public static JwtTokenDto of(String accessToken) {
        return new JwtTokenDto(accessToken);
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}