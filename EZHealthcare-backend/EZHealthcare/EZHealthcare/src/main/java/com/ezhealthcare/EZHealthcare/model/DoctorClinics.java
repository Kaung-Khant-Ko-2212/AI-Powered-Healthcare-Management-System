package com.ezhealthcare.EZHealthcare.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "doctor_clinics")
@Data
public class DoctorClinics{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    @JsonIgnoreProperties("hibernateLazyInitializer")
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "clinic_id", referencedColumnName = "id", nullable = true)

    @JsonIgnoreProperties("hibernateLazyInitializer")
    private Clinic clinic;

    private String day;
    private String startTime;
    private String endTime;
}