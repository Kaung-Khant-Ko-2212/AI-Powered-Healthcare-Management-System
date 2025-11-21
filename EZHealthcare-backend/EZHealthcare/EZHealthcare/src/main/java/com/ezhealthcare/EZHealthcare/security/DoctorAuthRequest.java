package com.ezhealthcare.EZHealthcare.security;

public class DoctorAuthRequest {

    private String email;  // Represents the email of the doctor
    private String password;

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "DoctorAuthRequest{" +
                "email='" + email + '\'' +
                ", password='[PROTECTED]'" + // Hiding password for security
                '}';
    }
}
