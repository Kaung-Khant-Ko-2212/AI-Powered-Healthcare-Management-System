package com.ezhealthcare.EZHealthcare.model;

public class AppointmentRequest {
    private Long doctorId;
    private Long hospitalId;
    private Long clinicId;
    private String appointmentDate;  // e.g., "2025-02-13"
    private String appointmentTime;  // e.g., "09:00:00"

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public void setAppointmentDate(String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    // Getters and Setters for each field

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public Long getClinicId() {
        return clinicId;
    }

    public void setClinicId(Long clinicId) {
        this.clinicId = clinicId;
    }
}

