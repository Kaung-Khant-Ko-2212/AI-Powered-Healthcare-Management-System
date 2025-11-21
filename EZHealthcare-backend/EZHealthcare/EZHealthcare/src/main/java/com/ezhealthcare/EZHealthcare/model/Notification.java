package com.ezhealthcare.EZHealthcare.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "notifications")
public class Notification {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Getter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties("hibernateLazyInitializer")
    private User user;

    @Setter
    @Getter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "appointment_id", referencedColumnName = "id", nullable = false)
    private Appointment appointment;

    // Add getter for appointment location
    public String getAppointmentLocation() {
        if (appointment != null) {
            if (appointment.getHospital() != null) {
                return appointment.getHospital().getName() + " (Hospital)";
            } else if (appointment.getClinic() != null) {
                return appointment.getClinic().getName() + " (Clinic)";
            }
        }
        return "N/A";
    }

    // Add getter for formatted appointment time
    public String getAppointmentDateTime() {
        if (appointment != null) {
            return appointment.getAppointmentDate() + " / " +
                    appointment.getAppointmentTime().toString().substring(0, 5);
        }
        return null;
    }

    @Setter
    @Getter
    private String title;
    @Setter
    @Getter
    private String status;  // 'confirmed' or 'cancelled'

    @Setter
    @Getter
    @CreationTimestamp
    private Timestamp createdAt;

    private boolean isRead = false;

    // Getters and setters


    public boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(boolean isRead) {
        this.isRead = isRead;
    }
}
