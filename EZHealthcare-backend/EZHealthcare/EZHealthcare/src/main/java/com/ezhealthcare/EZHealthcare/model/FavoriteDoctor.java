package com.ezhealthcare.EZHealthcare.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "favorite_doctors")
public class FavoriteDoctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties("hibernateLazyInitializer") // Prevent lazy loading issues
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties("hibernateLazyInitializer") // Prevent lazy loading issues
    private User user;


    public FavoriteDoctor(Doctor doctor, User user) {
        this.doctor = doctor;
        this.user = user;
    }
    public FavoriteDoctor() {}


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}