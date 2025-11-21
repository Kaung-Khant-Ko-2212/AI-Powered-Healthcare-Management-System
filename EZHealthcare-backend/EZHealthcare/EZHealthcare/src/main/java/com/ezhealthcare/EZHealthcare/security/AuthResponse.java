package com.ezhealthcare.EZHealthcare.security;

public class AuthResponse {
    private String token; // Changed from "jwt" to "token"
    private Long userId;

    public AuthResponse(String token, Long userId) {
        this.token = token;
        this.userId = userId;
    }

    public String getToken() { return token; }
    public Long getUserId() { return userId; }
}