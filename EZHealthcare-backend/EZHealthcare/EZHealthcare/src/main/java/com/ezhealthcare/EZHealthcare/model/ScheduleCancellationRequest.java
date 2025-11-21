package com.ezhealthcare.EZHealthcare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Entity
@Table(name = "schedule_cancellation_requests")
public class ScheduleCancellationRequest {

    // Getters and Setters
    @Setter
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Getter
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Setter
    @Getter
    @Column(name = "reason", nullable = false)
    private String reason;

    @Column(name = "request_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date requestDate;

    @Setter
    @Getter
    @Column(name = "status", nullable = false)
    private String status = "Pending";

    // Constructors
    public ScheduleCancellationRequest() {
    }

    public ScheduleCancellationRequest(Doctor doctor, String reason, Date requestDate) {
        this.doctor = doctor;
        this.reason = reason;
        this.requestDate = requestDate;
        this.status = "Pending";
    }


    // **Fix: Add getDoctorId() method**
    public Long getDoctorId() {
        return doctor != null ? doctor.getId() : null;
    }

    public void setDoctorId(Long doctorId) {
        this.doctor = new Doctor();
        this.doctor.setId(doctorId);
    }

    public Date getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(Date requestDate) {
        this.requestDate = requestDate;
    }
}
