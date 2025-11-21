package com.ezhealthcare.EZHealthcare.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "doctors", schema = "ezdatabase")
public class Doctor {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Getter
    @Column(nullable = false)
    private String name;

    @Getter
    @Setter
    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Setter
    @Getter
    @Column(nullable = false, unique = true) // Ensure email is not null and unique
    private String email;

    @Setter
    @Getter
    private String degree;
    @Setter
    @Getter
    private String experience;
    @Getter
    @Setter
    private Timestamp createdAt;
    @Setter
    @Getter
    @Column(nullable = true)
    private String image;
    @Setter
    @Getter
    private String password;

    @Setter
    @Getter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "specialty_id", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties("hibernateLazyInitializer") // Prevent lazy loading issues
    private Specialty specialty;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ScheduleCancellationRequest> dateLockRequests;

    @Setter
    @Getter
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "doctor_hospitals",
            joinColumns = @JoinColumn(name = "doctor_id"),
            inverseJoinColumns = @JoinColumn(name = "hospital_id")
    )
    @JsonIgnoreProperties("hibernateLazyInitializer") // Prevent lazy loading issues
    private Set<Hospital> hospitals; // ✅ Many-to-Many relationship

    // Getters and Setters
    @Setter
    @Getter
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "doctor_clinics",
            joinColumns = @JoinColumn(name = "doctor_id"),
            inverseJoinColumns = @JoinColumn(name = "clinic_id")
    )
    private List<Clinic> clinics = new ArrayList<>();

    // Add new getters and setters for doctorHospitals and doctorClinics
//    @Setter
//    @Getter
//    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
//    private Set<DoctorHospitals> doctorHospitals;
//
//    @Setter
//    @Getter
//    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    private List<DoctorClinics> doctorClinics = new ArrayList<>();
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private Set<DoctorHospitals> doctorHospitals;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<DoctorClinics> doctorClinics = new ArrayList<>();

    public Set<DoctorHospitals> getDoctorHospitals() {
        return doctorHospitals;
    }

    public void setDoctorHospitals(Set<DoctorHospitals> doctorHospitals) {
        this.doctorHospitals = doctorHospitals;
    }

    public List<DoctorClinics> getDoctorClinics() {
        return doctorClinics;
    }

    public void setDoctorClinics(List<DoctorClinics> doctorClinics) {
        this.doctorClinics = doctorClinics;
    }
}