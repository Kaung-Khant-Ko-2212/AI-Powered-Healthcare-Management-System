package com.ezhealthcare.EZHealthcare.security;

public class DoctorAuthResponse {

    private String token;
    private Long doctorId;
    public DoctorAuthResponse(String token, Long doctorId) { // ✅ Constructor updated
        this.token = token;
        this.doctorId = doctorId;
    }

    // Getters
    public String getToken() {
        return token;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    @Override
    public String toString() {
        return "DoctorAuthResponse{" +
                "token='" + token + '\'' +
                ", doctorId=" + doctorId  +
                '}';
    }
}
